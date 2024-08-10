import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameCreateQuery } from '../query/GameCreateQuery';
import { GameSpecCreateQueryFixtures } from './GameSpecCreateQueryFixtures';

export class GameCreateQueryFixtures {
  public static get any(): GameCreateQuery {
    const fixture: GameCreateQuery = {
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      isPublic: false,
      name: undefined,
      spec: GameSpecCreateQueryFixtures.any,
    };

    return fixture;
  }

  public static get withSpecWithCardsOneAndName(): GameCreateQuery {
    const anyFixture: GameCreateQuery = GameCreateQueryFixtures.any;

    const fixture: GameCreateQuery = {
      ...anyFixture,
      name: 'Name fixture',
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

  public static get withSpecWithCardsOneAndNameUndefined(): GameCreateQuery {
    const anyFixture: GameCreateQuery = GameCreateQueryFixtures.any;

    const fixture: GameCreateQuery = {
      ...anyFixture,
      name: undefined,
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

  public static get withSpecWithGameSlotAmountTwo(): GameCreateQuery {
    const anyFixture: GameCreateQuery = GameCreateQueryFixtures.any;

    const fixture: GameCreateQuery = {
      ...anyFixture,
      spec: {
        ...anyFixture.spec,
        gameSlotsAmount: 2,
      },
    };

    return fixture;
  }

  public static get withSpecWithGameSlotAmountTwoAndAHalf(): GameCreateQuery {
    const anyFixture: GameCreateQuery = GameCreateQueryFixtures.any;

    const fixture: GameCreateQuery = {
      ...anyFixture,
      spec: {
        ...anyFixture.spec,
        gameSlotsAmount: 2.5,
      },
    };

    return fixture;
  }

  public static get withSpecWithGameSlotAmountZero(): GameCreateQuery {
    const anyFixture: GameCreateQuery = GameCreateQueryFixtures.any;

    const fixture: GameCreateQuery = {
      ...anyFixture,
      spec: {
        ...anyFixture.spec,
        gameSlotsAmount: 0,
      },
    };

    return fixture;
  }
}
