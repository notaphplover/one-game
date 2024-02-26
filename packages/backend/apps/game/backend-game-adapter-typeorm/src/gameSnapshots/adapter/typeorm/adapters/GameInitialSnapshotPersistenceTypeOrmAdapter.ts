import { GameInitialSnapshotPersistenceOutputPort } from '@cornie-js/backend-game-application/gameSnapshots';
import {
  GameInitialSnapshotSlotCreateQuery,
  GameInitialSnapshotSlot,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { Injectable } from '@nestjs/common';

import { CreateGameInitialSnapshotSlotTypeOrmService } from '../services/CreateGameInitialSnapshotSlotTypeOrmService';

@Injectable()
export class GameInitialSnapshotPersistenceTypeOrmAdapter
  implements GameInitialSnapshotPersistenceOutputPort
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
  ): Promise<GameInitialSnapshotSlot> {
    return this.#createGameInitialSnapshotSlotTypeOrmService.insertOne(
      gameInitialSnapshotSlotCreateQuery,
    );
  }
}
