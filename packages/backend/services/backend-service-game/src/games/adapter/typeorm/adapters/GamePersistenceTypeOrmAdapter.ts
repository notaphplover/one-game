import { Inject, Injectable } from '@nestjs/common';

import { GamePersistenceOutputPort } from '../../../application/ports/output/GamePersistenceOutputPort';
import { Game } from '../../../domain/models/Game';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameFindQuery } from '../../../domain/query/GameFindQuery';
import { GameUpdateQuery } from '../../../domain/query/GameUpdateQuery';
import { CreateGameTypeOrmService } from '../services/CreateGameTypeOrmService';
import { FindGameTypeOrmService } from '../services/FindGameTypeOrmService';
import { UpdateGameTypeOrmService } from '../services/UpdateGameTypeOrmService';

@Injectable()
export class GamePersistenceTypeOrmAdapter
  implements GamePersistenceOutputPort
{
  readonly #createGameTypeOrmService: CreateGameTypeOrmService;
  readonly #findGameTypeOrmService: FindGameTypeOrmService;
  readonly #updateGameTypeOrmService: UpdateGameTypeOrmService;

  constructor(
    @Inject(CreateGameTypeOrmService)
    createGameTypeOrmService: CreateGameTypeOrmService,
    @Inject(FindGameTypeOrmService)
    findGameTypeOrmService: FindGameTypeOrmService,
    @Inject(UpdateGameTypeOrmService)
    updateGameTypeOrmService: UpdateGameTypeOrmService,
  ) {
    this.#createGameTypeOrmService = createGameTypeOrmService;
    this.#findGameTypeOrmService = findGameTypeOrmService;
    this.#updateGameTypeOrmService = updateGameTypeOrmService;
  }

  public async create(gameCreateQuery: GameCreateQuery): Promise<Game> {
    return this.#createGameTypeOrmService.insertOne(gameCreateQuery);
  }

  public async findOne(
    gameFindQuery: GameFindQuery,
  ): Promise<Game | undefined> {
    return this.#findGameTypeOrmService.findOne(gameFindQuery);
  }

  public async update(gameUpdateQuery: GameUpdateQuery): Promise<void> {
    await this.#updateGameTypeOrmService.update(gameUpdateQuery);
  }
}
