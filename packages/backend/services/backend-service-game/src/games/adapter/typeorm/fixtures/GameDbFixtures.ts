import { Writable } from '../../../../common/application/models/Writable';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameSlotDbFixtures } from './GameSlotDbFixtures';

export class GameDbFixtures {
  public static get withActiveFalseAndGameSlotsOne(): GameDb {
    const fixture: Writable<GameDb> = new GameDb();

    fixture.active = false;
    fixture.currentCard = null;
    fixture.currentColor = null;
    fixture.currentPlayingSlotIndex = null;
    fixture.gameSlotsDb = [GameSlotDbFixtures.nonActive];
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.specs = '[{ "amount": 1, "card": 39 }]';

    return fixture;
  }

  public static get withActivetrueAndGameSlotsOne(): GameDb {
    const fixture: Writable<GameDb> = new GameDb();

    fixture.active = true;
    fixture.currentCard = 39;
    fixture.currentColor = 32;
    fixture.currentDirection = GameDirectionDb.clockwise;
    fixture.currentPlayingSlotIndex = 0;
    fixture.gameSlotsDb = [GameSlotDbFixtures.activeWithOneCard];
    fixture.id = '6fbcdb6c-b03c-4754-94c1-9f664f036cde';
    fixture.specs = '[{ "amount": 1, "card": 39 }]';

    return fixture;
  }
}
