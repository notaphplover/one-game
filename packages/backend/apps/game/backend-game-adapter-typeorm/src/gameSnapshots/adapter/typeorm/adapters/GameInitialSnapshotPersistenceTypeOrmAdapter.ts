import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameInitialSnapshotPersistenceOutputPort } from '@cornie-js/backend-game-application/gameSnapshots';
import {
  GameInitialSnapshotCreateQuery,
  GameInitialSnapshot,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameInitialSnapshotTypeOrmService } from '../services/CreateGameInitialSnapshotTypeOrmService';

@Injectable()
export class GameInitialSnapshotPersistenceTypeOrmAdapter
  implements GameInitialSnapshotPersistenceOutputPort
{
  readonly #createGameInitialSnapshotTypeOrmService: CreateGameInitialSnapshotTypeOrmService;

  constructor(
    @Inject(CreateGameInitialSnapshotTypeOrmService)
    createGameInitialSnapshotTypeOrmService: CreateGameInitialSnapshotTypeOrmService,
  ) {
    this.#createGameInitialSnapshotTypeOrmService =
      createGameInitialSnapshotTypeOrmService;
  }

  public async create(
    gameInitialSnapshotSlotCreateQuery: GameInitialSnapshotCreateQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<GameInitialSnapshot> {
    return this.#createGameInitialSnapshotTypeOrmService.insertOne(
      gameInitialSnapshotSlotCreateQuery,
      transactionWrapper,
    );
  }
}
