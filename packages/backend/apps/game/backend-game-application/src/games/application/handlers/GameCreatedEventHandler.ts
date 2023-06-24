import { Handler } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { GameCreatedEvent } from '../models/GameCreatedEvent';
import {
  GameOptionsPersistenceOutputPort,
  gameOptionsPersistenceOutputPortSymbol,
} from '../ports/output/GameOptionsPersistenceOutputPort';

@Injectable()
export class GameCreatedEventHandler
  implements Handler<[GameCreatedEvent], void>
{
  readonly #gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort;

  constructor(
    @Inject(gameOptionsPersistenceOutputPortSymbol)
    gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort,
  ) {
    this.#gameOptionsPersistenceOutputPort = gameOptionsPersistenceOutputPort;
  }

  public async handle(gameCreatedEvent: GameCreatedEvent): Promise<void> {
    await this.#gameOptionsPersistenceOutputPort.create(
      gameCreatedEvent.gameCreateQuery.spec.options,
    );
  }
}
