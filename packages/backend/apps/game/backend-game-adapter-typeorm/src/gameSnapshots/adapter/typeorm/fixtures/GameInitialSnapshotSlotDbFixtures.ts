import { Writable } from '@cornie-js/backend-common';

import { GameInitialSnapshotDb } from '../models/GameInitialSnapshotDb';
import { GameInitialSnapshotSlotDb } from '../models/GameInitialSnapshotSlotDb';

export class GameInitialSnapshotSlotDbFixtures {
  public static get any(): GameInitialSnapshotSlotDb {
    const gameInitialSnapshotSlotDb: Writable<GameInitialSnapshotSlotDb> =
      new GameInitialSnapshotSlotDb();

    gameInitialSnapshotSlotDb.cards = '[39]';
    gameInitialSnapshotSlotDb.id = 'ea7ea510-6588-4c1e-a58f-fed69c60c4a1';
    gameInitialSnapshotSlotDb.gameInitialSnapshot =
      null as unknown as GameInitialSnapshotDb;
    gameInitialSnapshotSlotDb.gameInitialSnapshotId = '';
    gameInitialSnapshotSlotDb.position = 0;
    gameInitialSnapshotSlotDb.userId = '83073aec-b81b-4107-97f9-baa46de5dd40';

    return gameInitialSnapshotSlotDb;
  }
}
