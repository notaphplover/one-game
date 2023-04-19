import { Inject, Injectable } from '@nestjs/common';

import { GamePersistenceOutputPort } from '../../../application/ports/output/GamePersistenceOutputPort';
import { Game } from '../../../domain/models/Game';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameFindQuery } from '../../../domain/query/GameFindQuery';
import { CreateGameTypeOrmService } from '../services/CreateGameTypeOrmService';
import { FindGameTypeOrmService } from '../services/FindGameTypeOrmService';

@Injectable()
export class GamePersistenceTypeOrmAdapter
  implements GamePersistenceOutputPort
{
  readonly #createGameTypeOrmService: CreateGameTypeOrmService;
  readonly #findGameTypeOrmService: FindGameTypeOrmService;

  constructor(
    @Inject(CreateGameTypeOrmService)
    createGameTypeOrmService: CreateGameTypeOrmService,
    @Inject(FindGameTypeOrmService)
    findGameTypeOrmService: FindGameTypeOrmService,
  ) {
    this.#createGameTypeOrmService = createGameTypeOrmService;
    this.#findGameTypeOrmService = findGameTypeOrmService;
  }

  public async create(gameCreateQuery: GameCreateQuery): Promise<Game> {
    return this.#createGameTypeOrmService.insertOne(gameCreateQuery);
  }

  public async findOne(
    gameFindQuery: GameFindQuery,
  ): Promise<Game | undefined> {
    return this.#findGameTypeOrmService.findOne(gameFindQuery);
  }
}
