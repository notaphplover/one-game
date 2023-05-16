import {
  GamePersistenceOutputPort,
  GameSlotPersistenceOutputPort,
  gameSlotPersistenceOutputPortSymbol,
} from '@cornie-js/backend-app-game-models/games/application';
import {
  Game,
  GameCreateQuery,
  GameFindQuery,
  GameSlotUpdateQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-app-game-models/games/domain';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameTypeOrmService } from '../services/CreateGameTypeOrmService';
import { FindGameTypeOrmService } from '../services/FindGameTypeOrmService';
import { UpdateGameTypeOrmService } from '../services/UpdateGameTypeOrmService';

@Injectable()
export class GamePersistenceTypeOrmAdapter
  implements GamePersistenceOutputPort
{
  readonly #createGameTypeOrmService: CreateGameTypeOrmService;
  readonly #findGameTypeOrmService: FindGameTypeOrmService;
  readonly #gameSlotPersistenceOutputPort: GameSlotPersistenceOutputPort;
  readonly #updateGameTypeOrmService: UpdateGameTypeOrmService;

  constructor(
    @Inject(CreateGameTypeOrmService)
    createGameTypeOrmService: CreateGameTypeOrmService,
    @Inject(FindGameTypeOrmService)
    findGameTypeOrmService: FindGameTypeOrmService,
    @Inject(gameSlotPersistenceOutputPortSymbol)
    gameSlotPersistenceOutputPort: GameSlotPersistenceOutputPort,
    @Inject(UpdateGameTypeOrmService)
    updateGameTypeOrmService: UpdateGameTypeOrmService,
  ) {
    this.#createGameTypeOrmService = createGameTypeOrmService;
    this.#findGameTypeOrmService = findGameTypeOrmService;
    this.#gameSlotPersistenceOutputPort = gameSlotPersistenceOutputPort;
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
    if (gameUpdateQuery.gameSlotUpdateQueries !== undefined) {
      await Promise.all(
        gameUpdateQuery.gameSlotUpdateQueries.map(
          async (gameSlotUpdateQuery: GameSlotUpdateQuery) =>
            this.#gameSlotPersistenceOutputPort.update(gameSlotUpdateQuery),
        ),
      );
    }

    await this.#updateGameTypeOrmService.update(gameUpdateQuery);
  }
}
