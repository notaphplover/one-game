import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameCreateQuery } from '../query/GameCreateQuery';

export class GameCreateQueryFixtures {
  public static get any(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      gameSlotIds: [],
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      spec: [],
    };

    return fixture;
  }

  public static get withGameSlotsIdOne(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      ...GameCreateQueryFixtures.any,
      gameSlotIds: ['dd29ebf8-c15d-4d41-ab3a-e39af9f37f58'],
    };

    return fixture;
  }

  public static get withSpecOne(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      ...GameCreateQueryFixtures.any,
      spec: [
        {
          amount: 1,
          card: CardFixtures.any,
        },
      ],
    };

    return fixture;
  }
}
