import { Writable } from '@cornie-js/backend-common';

import { GameDbFixtures } from '../../../../games/adapter/typeorm/fixtures/GameDbFixtures';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameInitialSnapshotDb } from '../models/GameInitialSnapshotDb';
import { GameInitialSnapshotSlotDbFixtures } from './GameInitialSnapshotSlotDbFixtures';

export class GameInitialSnapshotDbFixtures {
  public static get any(): GameInitialSnapshotDb {
    const fixture: Writable<GameInitialSnapshotDb> =
      new GameInitialSnapshotDb();

    fixture.currentCard = 39;
    fixture.currentColor = 32;
    fixture.currentDirection = GameDirectionDb.antiClockwise;
    fixture.currentPlayingSlotIndex = 0;
    fixture.deck = '[{ "amount": 1, "card": 39 }]';
    fixture.drawCount = 0;
    fixture.game = GameDbFixtures.withStatusActiveAndGameSlotsOne;
    fixture.gameId = GameDbFixtures.withStatusActiveAndGameSlotsOne.id;
    fixture.gameSlotsDb = [GameInitialSnapshotSlotDbFixtures.any];
    fixture.id = 'c86b6e87-f33f-422f-9477-265400d87c0a';

    return fixture;
  }
}
