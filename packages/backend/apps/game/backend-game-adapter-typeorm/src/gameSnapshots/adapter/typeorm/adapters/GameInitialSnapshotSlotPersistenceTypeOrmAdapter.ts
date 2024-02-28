import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameInitialSnapshotSlotPersistenceOutputPort } from '@cornie-js/backend-game-application/gameSnapshots';
import {
  GameInitialSnapshotSlotCreateQuery,
  GameInitialSnapshotSlot,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { Injectable } from '@nestjs/common';

import { CreateGameInitialSnapshotSlotTypeOrmService } from '../services/CreateGameInitialSnapshotSlotTypeOrmService';

@Injectable()
export class GameInitialSnapshotSlotPersistenceTypeOrmAdapter
  implements GameInitialSnapshotSlotPersistenceOutputPort
{
  readonly #createGameInitialSnapshotSlotTypeOrmService: CreateGameInitialSnapshotSlotTypeOrmService;

  constructor(
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
