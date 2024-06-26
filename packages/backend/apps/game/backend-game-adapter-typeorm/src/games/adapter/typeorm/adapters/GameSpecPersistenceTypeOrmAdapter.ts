import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameSpecPersistenceOutputPort } from '@cornie-js/backend-game-application/games';
import {
  GameSpec,
  GameSpecCreateQuery,
  GameSpecFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameSpecTypeOrmService } from '../services/CreateGameSpecTypeOrmService';
import { FindGameSpecTypeOrmService } from '../services/FindGameSpecTypeOrmService';

@Injectable()
export class GameSpecPersistenceTypeOrmAdapter
  implements GameSpecPersistenceOutputPort
{
  readonly #createGameSpecTypeOrmService: CreateGameSpecTypeOrmService;
  readonly #findGameSpecTypeOrmService: FindGameSpecTypeOrmService;

  constructor(
    @Inject(CreateGameSpecTypeOrmService)
    createGameSpecTypeOrmService: CreateGameSpecTypeOrmService,
    @Inject(FindGameSpecTypeOrmService)
    findGameSpecTypeOrmService: FindGameSpecTypeOrmService,
  ) {
    this.#createGameSpecTypeOrmService = createGameSpecTypeOrmService;
    this.#findGameSpecTypeOrmService = findGameSpecTypeOrmService;
  }

  public async create(
    gameSpecCreateQuery: GameSpecCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameSpec> {
    return this.#createGameSpecTypeOrmService.insertOne(
      gameSpecCreateQuery,
      transactionWrapper,
    );
  }

  public async find(gameSpecFindQuery: GameSpecFindQuery): Promise<GameSpec[]> {
    return this.#findGameSpecTypeOrmService.find(gameSpecFindQuery);
  }

  public async findOne(
    gameSpecFindQuery: GameSpecFindQuery,
  ): Promise<GameSpec | undefined> {
    return this.#findGameSpecTypeOrmService.findOne(gameSpecFindQuery);
  }
}
