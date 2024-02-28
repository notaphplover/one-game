import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameInitialSnapshotPersistenceOutputPort } from '@cornie-js/backend-game-application/gameSnapshots';
import {
  GameInitialSnapshotCreateQuery,
  GameInitialSnapshot,
} from '@cornie-js/backend-game-domain/gameSnapshots';

import { CreateGameInitialSnapshotTypeOrmService } from '../services/CreateGameInitialSnapshotTypeOrmService';

export class GameInitialSnapshotPersistenceTypeOrmAdapter
  implements GameInitialSnapshotPersistenceOutputPort
{
  readonly #createGameInitialSnapshotTypeOrmService: CreateGameInitialSnapshotTypeOrmService;

  constructor(
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
