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
    fixture.isPublic = false;
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
    fixture.isPublic = false;
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
    fixture.currentTurnCardsDrawn = false;
    fixture.currentTurnCardsPlayed = false;
    fixture.currentTurnSingleCardDraw = null;
    fixture.deck = '[{ "amount": 1, "card": 39 }]';
    fixture.discardPile = '[]';
    fixture.drawCount = 0;
    fixture.gameSlotsDb = [GameSlotDbFixtures.activeWithOneCard];
    fixture.gameSpecDb = GameSpecDbFixtures.any;
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.isPublic = false;
    fixture.skipCount = 0;
    fixture.status = GameStatusDb.active;
    fixture.turn = 1;
    fixture.turnExpiresAt = new Date('2020-01-01');

    return fixture;
  }

  public static get withStatusActiveAndGameSlotsOneAndCurrentTurnSingleCardDraw(): GameDb {
    const fixture: Writable<GameDb> =
      GameDbFixtures.withStatusActiveAndGameSlotsOne;

    fixture.currentTurnSingleCardDraw = 39;

    return fixture;
  }

  public static get withStatusActiveAndGameSlotsOneAndCurrentTurnSingleCardDrawNull(): GameDb {
    const fixture: Writable<GameDb> =
      GameDbFixtures.withStatusActiveAndGameSlotsOne;

    fixture.currentTurnSingleCardDraw = null;

    return fixture;
  }
}
