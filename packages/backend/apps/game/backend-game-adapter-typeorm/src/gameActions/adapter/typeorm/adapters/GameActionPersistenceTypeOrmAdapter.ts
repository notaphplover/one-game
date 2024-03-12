import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameActionPersistenceOutputPort } from '@cornie-js/backend-game-application/gameActions';
import {
  GameAction,
  GameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameActionTypeOrmService } from '../services/CreateGameActionTypeOrmService';

@Injectable()
export class GameActionPersistenceTypeOrmAdapter
  implements GameActionPersistenceOutputPort
{
  readonly #createGameActionTypeOrmService: CreateGameActionTypeOrmService;

  constructor(
    @Inject(CreateGameActionTypeOrmService)
    createGameActionTypeOrmService: CreateGameActionTypeOrmService,
  ) {
    this.#createGameActionTypeOrmService = createGameActionTypeOrmService;
  }

  public async create(
    gameActionCreateQuery: GameActionCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameAction> {
    return this.#createGameActionTypeOrmService.insertOne(
      gameActionCreateQuery,
      transactionWrapper,
    );
  }
}
