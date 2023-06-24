import { GameOptionsPersistenceOutputPort } from '@cornie-js/backend-game-application/games';
import {
  GameOptions,
  GameOptionsCreateQuery,
  GameOptionsFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameOptionsTypeOrmService } from '../services/CreateGameOptionsTypeOrmService';
import { FindGameOptionsTypeOrmService } from '../services/FindGameOptionsTypeOrmService';

@Injectable()
export class GameOptionsPersistenceTypeOrmAdapter
  implements GameOptionsPersistenceOutputPort
{
  readonly #createGameOptionsTypeOrmService: CreateGameOptionsTypeOrmService;
  readonly #findGameOptionsTypeOrmService: FindGameOptionsTypeOrmService;

  constructor(
    @Inject(CreateGameOptionsTypeOrmService)
    createGameOptionsTypeOrmService: CreateGameOptionsTypeOrmService,
    @Inject(FindGameOptionsTypeOrmService)
    findGameOptionsTypeOrmService: FindGameOptionsTypeOrmService,
  ) {
    this.#createGameOptionsTypeOrmService = createGameOptionsTypeOrmService;
    this.#findGameOptionsTypeOrmService = findGameOptionsTypeOrmService;
  }

  public async findOne(
    gameOptionsFindQuery: GameOptionsFindQuery,
  ): Promise<GameOptions | undefined> {
    return this.#findGameOptionsTypeOrmService.findOne(gameOptionsFindQuery);
  }

  public async create(
    gameOptionsCreateQuery: GameOptionsCreateQuery,
  ): Promise<GameOptions> {
    return this.#createGameOptionsTypeOrmService.insertOne(
      gameOptionsCreateQuery,
    );
  }
}
