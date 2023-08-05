import { Writable } from '@cornie-js/backend-common';

import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';

export class GameSlotDbFixtures {
  public static get finished(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = new GameSlotDb();

    fixture.cards = null;
    fixture.game = null as unknown as GameDb;
    fixture.gameId = 'e6b54159-a4ef-41fc-994a-20709526bdaa';
    fixture.id = '738e3afd-b015-4385-ad87-378475db4847';
    fixture.position = 0;
    fixture.userId = '83073aec-b81b-4107-97f9-baa46de5dd40';

    return fixture;
  }

  public static get finishedWithPositionZero(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = GameSlotDbFixtures.finished;

    fixture.position = 0;

    return fixture;
  }

  public static get finishedWithPositionOne(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = GameSlotDbFixtures.finished;

    fixture.position = 0;

    return fixture;
  }

  public static get nonStarted(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = new GameSlotDb();

    fixture.cards = null;
    fixture.game = null as unknown as GameDb;
    fixture.gameId = 'e6b54159-a4ef-41fc-994a-20709526bdaa';
    fixture.id = '738e3afd-b015-4385-ad87-378475db4847';
    fixture.position = 0;
    fixture.userId = '83073aec-b81b-4107-97f9-baa46de5dd40';

    return fixture;
  }

  public static get nonStartedWithPositionZero(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = GameSlotDbFixtures.nonStarted;

    fixture.position = 0;

    return fixture;
  }

  public static get nonStartedWithPositionOne(): GameSlotDb {
    const fixture: Writable<GameSlotDb> = GameSlotDbFixtures.nonStarted;

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
