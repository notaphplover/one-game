import { Inject, Injectable } from '@nestjs/common';

import { GamePersistenceOutputPort } from '../../../application/ports/output/GamePersistenceOutputPort';
import { Game } from '../../../domain/models/Game';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { CreateGameTypeOrmService } from '../services/CreateGameTypeOrmService';

@Injectable()
export class GamePersistenceTypeOrmAdapter
  implements GamePersistenceOutputPort
{
  readonly #createGameTypeOrmService: CreateGameTypeOrmService;

  constructor(
    @Inject(CreateGameTypeOrmService)
    createGameTypeOrmService: CreateGameTypeOrmService,
  ) {
    this.#createGameTypeOrmService = createGameTypeOrmService;
  }

  public async create(gameCreateQuery: GameCreateQuery): Promise<Game> {
    return this.#createGameTypeOrmService.insertOne(gameCreateQuery);
  }
}
