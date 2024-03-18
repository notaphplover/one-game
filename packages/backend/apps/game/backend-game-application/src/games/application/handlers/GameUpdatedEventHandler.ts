import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
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
import { Game } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import {
  GameActionPersistenceOutputPort,
  gameActionPersistenceOutputPortSymbol,
} from '../../../gameActions/application/ports/output/GameActionPersistenceOutputPort';
import { GameActionCreateQueryFromGameUpdateEventBuilder } from '../builders/GameActionCreateQueryFromGameUpdateEventBuilder';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
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
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#gameActionCreateQueryFromGameUpdateEventBuilder =
      gameActionCreateQueryFromGameUpdateEventBuilder;
    this.#gameActionPersistenceOutputPort = gameActionPersistenceOutputPort;
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
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

    await this.#publishGameUpdatedMessageEvent(game, gameAction);
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

    await this.#gameEventsSubscriptionOutputPort.publish(
      game.id,
      gameUpdatedMessageEvent,
    );
  }
}
