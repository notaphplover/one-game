import { Handler } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { GameCreatedEvent } from '../models/GameCreatedEvent';
import {
  GameOptionsPersistenceOutputPort,
  gameOptionsPersistenceOutputPortSymbol,
} from '../ports/output/GameOptionsPersistenceOutputPort';
import {
  GameSpecPersistenceOutputPort,
  gameSpecPersistenceOutputPortSymbol,
} from '../ports/output/GameSpecPersistenceOutputPort';

@Injectable()
export class GameCreatedEventHandler
  implements Handler<[GameCreatedEvent], void>
{
  readonly #gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;

  constructor(
    @Inject(gameOptionsPersistenceOutputPortSymbol)
    gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
  ) {
    this.#gameOptionsPersistenceOutputPort = gameOptionsPersistenceOutputPort;
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
  }

  public async handle(gameCreatedEvent: GameCreatedEvent): Promise<void> {
    await Promise.all([
      this.#gameOptionsPersistenceOutputPort.create(
        gameCreatedEvent.gameCreateQuery.spec.options,
      ),
      this.#gameSpecPersistenceOutputPort.create(
        gameCreatedEvent.gameCreateQuery.spec,
      ),
    ]);
  }
}
