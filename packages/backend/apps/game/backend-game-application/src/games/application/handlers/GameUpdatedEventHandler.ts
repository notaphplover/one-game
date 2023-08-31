import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameUpdatedEvent } from '../models/GameUpdatedEvent';
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
  implements Handler<[GameUpdatedEvent], void>
{
  readonly #gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;

  constructor(
    @Inject(gameEventsSubscriptionOutputPortSymbol)
    gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
  ) {
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
  }

  public async handle(gameUpdatedEvent: GameUpdatedEvent): Promise<void> {
    const gameId: string = gameUpdatedEvent.gameBeforeUpdate.id;
    const game: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne({
        id: gameId,
      });

    if (game === undefined) {
      throw new AppError(AppErrorKind.unknown, `Game "${gameId}" not found`);
    }

    const gameUpdatedMessageEvent: GameUpdatedMessageEvent = {
      game,
      kind: GameMessageEventKind.gameUpdated,
    };

    await this.#gameEventsSubscriptionOutputPort.publish(
      gameId,
      gameUpdatedMessageEvent,
    );
  }
}
