import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GamePersistenceOutputPort,
  GameSlotPersistenceOutputPort,
  gameSlotPersistenceOutputPortSymbol,
} from '@cornie-js/backend-game-application/games';
import {
  Game,
  GameCreateQuery,
  GameFindQuery,
  GameSlotUpdateQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
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

  public async create(
    gameCreateQuery: GameCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<Game> {
    return this.#createGameTypeOrmService.insertOne(
      gameCreateQuery,
      transactionWrapper,
    );
  }

  public async find(
    gameFindQuery: GameFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<Game[]> {
    return this.#findGameTypeOrmService.find(gameFindQuery, transactionWrapper);
  }

  public async findOne(
    gameFindQuery: GameFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<Game | undefined> {
    return this.#findGameTypeOrmService.findOne(
      gameFindQuery,
      transactionWrapper,
    );
  }

  public async update(
    gameUpdateQuery: GameUpdateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<void> {
    if (gameUpdateQuery.gameSlotUpdateQueries !== undefined) {
      await Promise.all(
        gameUpdateQuery.gameSlotUpdateQueries.map(
          async (gameSlotUpdateQuery: GameSlotUpdateQuery) =>
            this.#gameSlotPersistenceOutputPort.update(
              gameSlotUpdateQuery,
              transactionWrapper,
            ),
        ),
      );
    }

    await this.#updateGameTypeOrmService.update(
      gameUpdateQuery,
      transactionWrapper,
    );
  }
}
