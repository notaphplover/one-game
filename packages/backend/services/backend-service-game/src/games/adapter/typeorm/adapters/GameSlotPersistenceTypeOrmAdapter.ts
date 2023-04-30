import { Inject, Injectable } from '@nestjs/common';

import { GameSlotPersistenceOutputPort } from '../../../application/ports/output/GameSlotPersistenceOutputPort';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
import { GameSlotUpdateQuery } from '../../../domain/query/GameSlotUpdateQuery';
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
