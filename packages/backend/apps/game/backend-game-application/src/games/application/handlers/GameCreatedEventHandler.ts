import { Handler } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { GameCreatedEvent } from '../models/GameCreatedEvent';
import {
  GameSpecPersistenceOutputPort,
  gameSpecPersistenceOutputPortSymbol,
} from '../ports/output/GameSpecPersistenceOutputPort';

@Injectable()
export class GameCreatedEventHandler
  implements Handler<[GameCreatedEvent], void>
{
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;

  constructor(
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
  ) {
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
  }

  public async handle(gameCreatedEvent: GameCreatedEvent): Promise<void> {
    await this.#gameSpecPersistenceOutputPort.create(
      gameCreatedEvent.gameCreateQuery.spec,
    );
  }
}
