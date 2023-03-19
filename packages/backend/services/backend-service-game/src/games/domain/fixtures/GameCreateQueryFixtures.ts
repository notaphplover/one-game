import { GameCreateQuery } from '../query/GameCreateQuery';

export class GameCreateQueryFixtures {
  public static get any(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      gameSlotIds: [],
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
    };

    return fixture;
  }

  public static get withGameSlotsIdOne(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      gameSlotIds: ['dd29ebf8-c15d-4d41-ab3a-e39af9f37f58'],
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
    };

    return fixture;
  }
}
