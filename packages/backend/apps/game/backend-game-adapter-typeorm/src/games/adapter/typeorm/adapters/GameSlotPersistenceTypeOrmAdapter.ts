import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameSlotPersistenceOutputPort } from '@cornie-js/backend-game-application/games';
import {
  ActiveGameSlot,
  GameSlotCreateQuery,
  GameSlotUpdateQuery,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameSlotTypeOrmService } from '../services/CreateGameSlotTypeOrmService';
import { UpdateGameSlotTypeOrmService } from '../services/UpdateGameSlotTypeOrmService';

@Injectable()
export class GameSlotPersistenceTypeOrmAdapter
  implements GameSlotPersistenceOutputPort
{
  readonly #createGameSlotTypeOrmService: CreateGameSlotTypeOrmService;
  readonly #updateGameSlotTypeOrmService: UpdateGameSlotTypeOrmService;

  constructor(
    @Inject(CreateGameSlotTypeOrmService)
    createGameTypeOrmService: CreateGameSlotTypeOrmService,
    @Inject(UpdateGameSlotTypeOrmService)
    updateGameSlotTypeOrmService: UpdateGameSlotTypeOrmService,
  ) {
    this.#createGameSlotTypeOrmService = createGameTypeOrmService;
    this.#updateGameSlotTypeOrmService = updateGameSlotTypeOrmService;
  }

  public async create(
    gameSlotCreateQuery: GameSlotCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<ActiveGameSlot | NonStartedGameSlot> {
    return this.#createGameSlotTypeOrmService.insertOne(
      gameSlotCreateQuery,
      transactionWrapper,
    );
  }

  public async update(
    gameSlotUpdateQuery: GameSlotUpdateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<void> {
    await this.#updateGameSlotTypeOrmService.update(
      gameSlotUpdateQuery,
      transactionWrapper,
    );
  }
}
