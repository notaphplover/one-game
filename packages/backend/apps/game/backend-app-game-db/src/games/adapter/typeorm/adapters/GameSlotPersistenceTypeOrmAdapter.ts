import { GameSlotPersistenceOutputPort } from '@cornie-js/backend-app-game-models/games/application';
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
  ): Promise<ActiveGameSlot | NonStartedGameSlot> {
    return this.#createGameSlotTypeOrmService.insertOne(gameSlotCreateQuery);
  }

  public async update(gameSlotUpdateQuery: GameSlotUpdateQuery): Promise<void> {
    await this.#updateGameSlotTypeOrmService.update(gameSlotUpdateQuery);
  }
}
