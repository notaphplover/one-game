import { Writable } from '@cornie-js/backend-common';

import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';

export class GameSlotDbFixtures {
  public static get nonActive(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = new GameSlotDb();

    fixture.cards = null;
    fixture.game = null as unknown as GameDb;
    fixture.gameId = 'e6b54159-a4ef-41fc-994a-20709526bdaa';
    fixture.id = '738e3afd-b015-4385-ad87-378475db4847';
    fixture.position = 0;
    fixture.userId = '83073aec-b81b-4107-97f9-baa46de5dd40';

    return fixture;
  }

  public static get nonActiveWithPositionZero(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = GameSlotDbFixtures.nonActive;

    fixture.position = 0;

    return fixture;
  }

  public static get nonActiveWithPositionOne(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = GameSlotDbFixtures.nonActive;

    fixture.position = 0;

    return fixture;
  }

  public static get activeWithOneCard(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = new GameSlotDb();

    fixture.cards = '[39]';
    fixture.game = null as unknown as GameDb;
    fixture.gameId = 'e6b54159-a4ef-41fc-994a-20709526bdaa';
    fixture.id = '738e3afd-b015-4385-ad87-378475db4847';
    fixture.position = 0;
    fixture.userId = '83073aec-b81b-4107-97f9-baa46de5dd40';

    return fixture;
  }
}
