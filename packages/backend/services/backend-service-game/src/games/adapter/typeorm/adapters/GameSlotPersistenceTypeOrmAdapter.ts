import { Inject, Injectable } from '@nestjs/common';

import { GameSlotPersistenceOutputPort } from '../../../application/ports/output/GameSlotPersistenceOutputPort';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
import { CreateGameSlotTypeOrmService } from '../services/CreateGameSlotTypeOrmService';

@Injectable()
export class GameSlotPersistenceTypeOrmAdapter
  implements GameSlotPersistenceOutputPort
{
  readonly #createGameSlotTypeOrmService: CreateGameSlotTypeOrmService;

  constructor(
    @Inject(CreateGameSlotTypeOrmService)
    createGameTypeOrmService: CreateGameSlotTypeOrmService,
  ) {
    this.#createGameSlotTypeOrmService = createGameTypeOrmService;
  }

  public async create(
    gameSlotCreateQuery: GameSlotCreateQuery,
  ): Promise<ActiveGameSlot | NonStartedGameSlot> {
    return this.#createGameSlotTypeOrmService.insertOne(gameSlotCreateQuery);
  }
}
