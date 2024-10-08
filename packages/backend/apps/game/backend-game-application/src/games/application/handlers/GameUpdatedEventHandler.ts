import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { MessageDeliveryScheduleKind } from '@cornie-js/backend-application-messaging';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import {
  GameAction,
  GameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import {
  Game,
  GameStatus,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  Optional,
} from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import {
  GameActionPersistenceOutputPort,
  gameActionPersistenceOutputPortSymbol,
} from '../../../gameActions/application/ports/output/GameActionPersistenceOutputPort';
import { GameActionCreateQueryFromGameUpdateEventBuilder } from '../builders/GameActionCreateQueryFromGameUpdateEventBuilder';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { ActiveGameUpdatedEventKind } from '../models/ActiveGameUpdatedEventKind';
import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameUpdatedMessageEvent } from '../models/GameUpdatedMessageEvent';
import {
  GameEventsSubscriptionOutputPort,
  gameEventsSubscriptionOutputPortSymbol,
} from '../ports/output/GameEventsSubscriptionOutputPort';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../ports/output/GamePersistenceOutputPort';
import {
  GameTurnEndSignalMessageSendOutputPort,
  gameTurnEndSignalMessageSendOutputPortSymbol,
} from '../ports/output/GameTurnEndSignalMessageSendOutputPort';

const GAME_TURN_SIGNAL_DELAY_MS: number = 30000;

@Injectable()
export class GameUpdatedEventHandler
  implements Handler<[ActiveGameUpdatedEvent], void>
{
  readonly #gameActionCreateQueryFromGameUpdateEventBuilder: Builder<
    GameActionCreateQuery,
    [ActiveGameUpdatedEvent, UuidContext]
  >;
  readonly #gameActionPersistenceOutputPort: GameActionPersistenceOutputPort;
  readonly #gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameTurnEndSignalMessageSendOutputPort:
    | GameTurnEndSignalMessageSendOutputPort
    | undefined;
  readonly #logger: LoggerService;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(GameActionCreateQueryFromGameUpdateEventBuilder)
    gameActionCreateQueryFromGameUpdateEventBuilder: Builder<
      GameActionCreateQuery,
      [ActiveGameUpdatedEvent, UuidContext]
    >,
    @Inject(gameActionPersistenceOutputPortSymbol)
    gameActionPersistenceOutputPort: GameActionPersistenceOutputPort,
    @Inject(gameEventsSubscriptionOutputPortSymbol)
    gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(gameTurnEndSignalMessageSendOutputPortSymbol)
    @Optional()
    gameTurnEndSignalMessageSendOutputPort:
      | GameTurnEndSignalMessageSendOutputPort
      | undefined,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#gameActionCreateQueryFromGameUpdateEventBuilder =
      gameActionCreateQueryFromGameUpdateEventBuilder;
    this.#gameActionPersistenceOutputPort = gameActionPersistenceOutputPort;
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#gameTurnEndSignalMessageSendOutputPort =
      gameTurnEndSignalMessageSendOutputPort;
    this.#logger = new Logger(GameUpdatedEventHandler.name);
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async handle(gameUpdatedEvent: ActiveGameUpdatedEvent): Promise<void> {
    const gameId: string = gameUpdatedEvent.gameBeforeUpdate.id;
    const game: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne(
        {
          id: gameId,
        },
        gameUpdatedEvent.transactionWrapper,
      );

    if (game === undefined) {
      throw new AppError(AppErrorKind.unknown, `Game "${gameId}" not found`);
    }

    const gameAction: GameAction =
      await this.#createGameAction(gameUpdatedEvent);

    await this.#updateLastGameActionId(gameAction, gameUpdatedEvent);

    await this.#publishGameUpdatedMessageEvent(game, gameAction);

    if (gameUpdatedEvent.kind === ActiveGameUpdatedEventKind.turnPass) {
      await this.#sendGameTurnEndSignal(game);
    }
  }

  async #createGameAction(
    gameUpdatedEvent: ActiveGameUpdatedEvent,
  ): Promise<GameAction> {
    const uuidContext: UuidContext = {
      uuid: this.#uuidProviderOutputPort.generateV4(),
    };
    const gameActionCreateQuery: GameActionCreateQuery =
      this.#gameActionCreateQueryFromGameUpdateEventBuilder.build(
        gameUpdatedEvent,
        uuidContext,
      );

    return this.#gameActionPersistenceOutputPort.create(
      gameActionCreateQuery,
      gameUpdatedEvent.transactionWrapper,
    );
  }

  async #publishGameUpdatedMessageEvent(
    game: Game,
    gameAction: GameAction,
  ): Promise<void> {
    const gameUpdatedMessageEvent: GameUpdatedMessageEvent = {
      game,
      gameAction,
      kind: GameMessageEventKind.gameUpdated,
    };

    await this.#gameEventsSubscriptionOutputPort.publishV2(
      game.id,
      gameUpdatedMessageEvent,
    );
  }

  async #sendGameTurnEndSignal(game: Game): Promise<void> {
    if (game.state.status !== GameStatus.active) {
      this.#logger
        .warn(`Unexpected non active game when sending game turn end signal:

${JSON.stringify(game)}

No end turn signal will be delivered`);

      return;
    }

    if (this.#gameTurnEndSignalMessageSendOutputPort !== undefined) {
      this.#logger.log(
        `Detected end of turn ${game.state.turn.toString()} of game "${game.id}", sending signal...`,
      );

      await this.#gameTurnEndSignalMessageSendOutputPort.send({
        data: {
          gameId: game.id,
          turn: game.state.turn,
        },
        delivery: {
          schedule: {
            delayMs: GAME_TURN_SIGNAL_DELAY_MS,
            kind: MessageDeliveryScheduleKind.delay,
          },
        },
      });

      this.#logger.log(
        `End of turn signal sent for game "${game.id}" (at turn ${game.state.turn.toString()})`,
      );
    } else {
      this.#logger.log(
        `Detected end of turn ${game.state.turn.toString()} of game "${game.id}", no signal is sent`,
      );
    }
  }

  async #updateLastGameActionId(
    gameAction: GameAction,
    gameUpdatedEvent: ActiveGameUpdatedEvent,
  ): Promise<void> {
    const gameUpdateQuery: GameUpdateQuery = {
      gameFindQuery: {
        id: gameAction.gameId,
      },
      lastGameActionId: gameAction.id,
    };

    await this.#gamePersistenceOutputPort.update(
      gameUpdateQuery,
      gameUpdatedEvent.transactionWrapper,
    );
  }
}
