import { Writable } from '@cornie-js/backend-common';

import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameStatusDb } from '../models/GameStatusDb';
import { GameSlotDbFixtures } from './GameSlotDbFixtures';

export class GameDbFixtures {
  public static get withStatusNonStarted(): GameDb {
    const fixture: Writable<GameDb> = new GameDb();

    fixture.currentCard = null;
    fixture.currentColor = null;
    fixture.currentPlayingSlotIndex = null;
    fixture.deck = '[{ "amount": 1, "card": 39 }]';
    fixture.discardPile = '[]';
    fixture.gameSlotsDb = [GameSlotDbFixtures.nonActiveWithPositionZero];
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.spec = '[{ "amount": 1, "card": 39 }]';
    fixture.status = GameStatusDb.nonStarted;

    return fixture;
  }

  public static get withStatusNonStartedAndGameSlotsOne(): GameDb {
    const fixture: Writable<GameDb> = GameDbFixtures.withStatusNonStarted;

    fixture.gameSlotsDb = [GameSlotDbFixtures.nonActiveWithPositionZero];

    return fixture;
  }

  public static get withStatusNonStartedAndGameSlotsTwo(): GameDb {
    const fixture: Writable<GameDb> = GameDbFixtures.withStatusNonStarted;

    fixture.gameSlotsDb = [
      GameSlotDbFixtures.nonActiveWithPositionZero,
      GameSlotDbFixtures.nonActiveWithPositionOne,
    ];

    return fixture;
  }

  public static get withStatusActiveAndGameSlotsOne(): GameDb {
    const fixture: Writable<GameDb> = new GameDb();

    fixture.currentCard = 39;
    fixture.currentColor = 32;
    fixture.currentDirection = GameDirectionDb.clockwise;
    fixture.currentPlayingSlotIndex = 0;
    fixture.currentTurnCardsPlayed = false;
    fixture.deck = '[{ "amount": 1, "card": 39 }]';
    fixture.discardPile = '[]';
    fixture.drawCount = 0;
    fixture.gameSlotsDb = [GameSlotDbFixtures.activeWithOneCard];
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.spec = '[{ "amount": 1, "card": 39 }]';
    fixture.status = GameStatusDb.active;

    return fixture;
  }
}
