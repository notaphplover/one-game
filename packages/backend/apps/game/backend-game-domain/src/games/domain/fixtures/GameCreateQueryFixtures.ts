import { GameOptionsCreateQueryFixtures } from '.';
import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameCreateQuery } from '../query/GameCreateQuery';

export class GameCreateQueryFixtures {
  public static get any(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      gameSlotsAmount: 1,
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      spec: {
        cards: [],
        options: GameOptionsCreateQueryFixtures.any,
      },
    };

    return fixture;
  }

  public static get withSpecOne(): GameCreateQuery {
    const anyFixture: GameCreateQuery = GameCreateQueryFixtures.any;

    const fixture: GameCreateQuery = {
      ...anyFixture,
      spec: {
        ...anyFixture.spec,
        cards: [
          {
            amount: 1,
            card: CardFixtures.any,
          },
        ],
      },
    };

    return fixture;
  }
}
