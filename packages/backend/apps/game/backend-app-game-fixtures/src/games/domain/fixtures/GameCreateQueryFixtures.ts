import { GameCreateQuery } from '@cornie-js/backend-game-domain/games';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';

export class GameCreateQueryFixtures {
  public static get any(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      gameSlotsAmount: 1,
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      spec: {
        cards: [],
      },
    };

    return fixture;
  }

  public static get withSpecOne(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      ...GameCreateQueryFixtures.any,
      spec: {
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
