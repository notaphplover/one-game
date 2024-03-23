import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameActionPersistenceOutputPort } from '@cornie-js/backend-game-application/gameActions';
import {
  GameAction,
  GameActionCreateQuery,
  GameActionFindQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameActionTypeOrmService } from '../services/CreateGameActionTypeOrmService';
import { FindGameActionTypeOrmService } from '../services/FindGameActionTypeOrmService';

@Injectable()
export class GameActionPersistenceTypeOrmAdapter
  implements GameActionPersistenceOutputPort
{
  readonly #createGameActionTypeOrmService: CreateGameActionTypeOrmService;
  readonly #findGameActionTypeOrmService: FindGameActionTypeOrmService;

  constructor(
    @Inject(CreateGameActionTypeOrmService)
    createGameActionTypeOrmService: CreateGameActionTypeOrmService,
    @Inject(FindGameActionTypeOrmService)
    findGameActionTypeOrmService: FindGameActionTypeOrmService,
  ) {
    this.#createGameActionTypeOrmService = createGameActionTypeOrmService;
    this.#findGameActionTypeOrmService = findGameActionTypeOrmService;
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

  public async find(
    gameActionFindQuery: GameActionFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameAction[]> {
    return this.#findGameActionTypeOrmService.find(
      gameActionFindQuery,
      transactionWrapper,
    );
  }

  public async findOne(
    gameActionFindQuery: GameActionFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameAction | undefined> {
    return this.#findGameActionTypeOrmService.findOne(
      gameActionFindQuery,
      transactionWrapper,
    );
  }
}
