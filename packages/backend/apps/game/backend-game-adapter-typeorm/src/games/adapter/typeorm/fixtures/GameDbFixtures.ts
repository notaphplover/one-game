import { Writable } from '@cornie-js/backend-common';

import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameStatusDb } from '../models/GameStatusDb';
import { GameSlotDbFixtures } from './GameSlotDbFixtures';
import { GameSpecDbFixtures } from './GameSpecDbFixtures';

export class GameDbFixtures {
  public static get withStatusFinished(): GameDb {
    const fixture: Writable<GameDb> = new GameDb();

    fixture.currentCard = null;
    fixture.currentColor = null;
    fixture.currentPlayingSlotIndex = null;
    fixture.deck = '[{ "amount": 1, "card": 39 }]';
    fixture.discardPile = '[]';
    fixture.gameSlotsDb = [GameSlotDbFixtures.nonStartedWithPositionZero];
    fixture.gameSpecDb = GameSpecDbFixtures.any;
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.status = GameStatusDb.finished;

    return fixture;
  }

  public static get withStatusFinishedAndGameSlotsTwo(): GameDb {
    const fixture: Writable<GameDb> = GameDbFixtures.withStatusFinished;

    fixture.gameSlotsDb = [
      GameSlotDbFixtures.finishedWithPositionZero,
      GameSlotDbFixtures.finishedWithPositionOne,
    ];

    return fixture;
  }

  public static get withStatusNonStarted(): GameDb {
    const fixture: Writable<GameDb> = new GameDb();

    fixture.currentCard = null;
    fixture.currentColor = null;
    fixture.currentPlayingSlotIndex = null;
    fixture.deck = '[{ "amount": 1, "card": 39 }]';
    fixture.discardPile = '[]';
    fixture.gameSlotsDb = [GameSlotDbFixtures.nonStartedWithPositionZero];
    fixture.gameSpecDb = GameSpecDbFixtures.any;
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.status = GameStatusDb.nonStarted;

    return fixture;
  }

  public static get withStatusNonStartedAndGameSlotsOne(): GameDb {
    const fixture: Writable<GameDb> = GameDbFixtures.withStatusNonStarted;

    fixture.gameSlotsDb = [GameSlotDbFixtures.nonStartedWithPositionZero];

    return fixture;
  }

  public static get withStatusNonStartedAndGameSlotsTwo(): GameDb {
    const fixture: Writable<GameDb> = GameDbFixtures.withStatusNonStarted;

    fixture.gameSlotsDb = [
      GameSlotDbFixtures.nonStartedWithPositionZero,
      GameSlotDbFixtures.nonStartedWithPositionOne,
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
    fixture.gameSpecDb = GameSpecDbFixtures.any;
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.status = GameStatusDb.active;
    fixture.turn = 1;

    return fixture;
  }
}
