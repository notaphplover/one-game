import { Writable } from '@cornie-js/backend-common';

import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameSlotDbFixtures } from './GameSlotDbFixtures';

export class GameDbFixtures {
  public static get withActiveFalse(): GameDb {
    const fixture: Writable<GameDb> = new GameDb();

    fixture.active = false;
    fixture.currentCard = null;
    fixture.currentColor = null;
    fixture.currentPlayingSlotIndex = null;
    fixture.deck = '[{ "amount": 1, "card": 39 }]';
    fixture.gameSlotsDb = [GameSlotDbFixtures.nonActiveWithPositionZero];
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.spec = '[{ "amount": 1, "card": 39 }]';

    return fixture;
  }

  public static get withActiveFalseAndGameSlotsOne(): GameDb {
    const fixture: Writable<GameDb> = GameDbFixtures.withActiveFalse;

    fixture.gameSlotsDb = [GameSlotDbFixtures.nonActiveWithPositionZero];

    return fixture;
  }

  public static get withActiveFalseAndGameSlotsTwo(): GameDb {
    const fixture: Writable<GameDb> = GameDbFixtures.withActiveFalse;

    fixture.gameSlotsDb = [
      GameSlotDbFixtures.nonActiveWithPositionZero,
      GameSlotDbFixtures.nonActiveWithPositionOne,
    ];

    return fixture;
  }

  public static get withActiveTrueAndGameSlotsOne(): GameDb {
    const fixture: Writable<GameDb> = new GameDb();

    fixture.active = true;
    fixture.currentCard = 39;
    fixture.currentColor = 32;
    fixture.currentDirection = GameDirectionDb.clockwise;
    fixture.currentPlayingSlotIndex = 0;
    fixture.currentTurnCardsPlayed = false;
    fixture.deck = '[{ "amount": 1, "card": 39 }]';
    fixture.drawCount = 0;
    fixture.gameSlotsDb = [GameSlotDbFixtures.activeWithOneCard];
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.spec = '[{ "amount": 1, "card": 39 }]';

    return fixture;
  }
}
