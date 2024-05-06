import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameInitialSnapshotSlotPersistenceOutputPort } from '@cornie-js/backend-game-application/gameSnapshots';
import {
  GameInitialSnapshotSlot,
  GameInitialSnapshotSlotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameInitialSnapshotSlotTypeOrmService } from '../services/CreateGameInitialSnapshotSlotTypeOrmService';

@Injectable()
export class GameInitialSnapshotSlotPersistenceTypeOrmAdapter
  implements GameInitialSnapshotSlotPersistenceOutputPort
{
  readonly #createGameInitialSnapshotSlotTypeOrmService: CreateGameInitialSnapshotSlotTypeOrmService;

  constructor(
    @Inject(CreateGameInitialSnapshotSlotTypeOrmService)
    createGameInitialSnapshotSlotTypeOrmService: CreateGameInitialSnapshotSlotTypeOrmService,
  ) {
    this.#createGameInitialSnapshotSlotTypeOrmService =
      createGameInitialSnapshotSlotTypeOrmService;
  }

  public async create(
    gameInitialSnapshotSlotCreateQuery: GameInitialSnapshotSlotCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameInitialSnapshotSlot> {
    return this.#createGameInitialSnapshotSlotTypeOrmService.insertOne(
      gameInitialSnapshotSlotCreateQuery,
      transactionWrapper,
    );
  }
}
