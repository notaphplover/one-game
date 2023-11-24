import { GameSpecPersistenceOutputPort } from '@cornie-js/backend-game-application/games';
import {
  GameSpecCreateQuery,
  GameSpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameSpecTypeOrmService } from '../services/CreateGameSpecTypeOrmService';

@Injectable()
export class GameSpecPersistenceTypeOrmAdapter
  implements GameSpecPersistenceOutputPort
{
  readonly #createGameSpecTypeOrmService: CreateGameSpecTypeOrmService;

  constructor(
    @Inject(CreateGameSpecTypeOrmService)
    createGameSpecTypeOrmService: CreateGameSpecTypeOrmService,
  ) {
    this.#createGameSpecTypeOrmService = createGameSpecTypeOrmService;
  }

  public async create(
    gameSpecCreateQuery: GameSpecCreateQuery,
  ): Promise<GameSpec> {
    return this.#createGameSpecTypeOrmService.insertOne(gameSpecCreateQuery);
  }
}
