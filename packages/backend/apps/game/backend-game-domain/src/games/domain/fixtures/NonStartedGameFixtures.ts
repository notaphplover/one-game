import { NonStartedGame } from '../entities/NonStartedGame';
import { GameStatus } from '../valueObjects/GameStatus';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';
import { GameSpecFixtures } from './GameSpecFixtures';
import { NonStartedGameSlotFixtures } from './NonStartedGameSlotFixtures';

export class NonStartedGameFixtures {
  public static get any(): NonStartedGame {
    const fixture: NonStartedGame = {
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      name: 'Game name',
      spec: GameSpecFixtures.any,
      state: {
        slots: [NonStartedGameSlotFixtures.withPositionZero],
        status: GameStatus.nonStarted,
      },
    };

    return fixture;
  }

  public static get withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount0(): NonStartedGame {
    const anyNonStartedGameFixture: NonStartedGame = NonStartedGameFixtures.any;

    return {
      ...anyNonStartedGameFixture,
      spec: {
        cards: [GameCardSpecFixtures.withAmount0],
        gameSlotsAmount: 2,
      },
      state: {
        ...anyNonStartedGameFixture.state,
        slots: [
          NonStartedGameSlotFixtures.withPositionZero,
          NonStartedGameSlotFixtures.withPositionOne,
        ],
      },
    };
  }

  public static get withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120(): NonStartedGame {
    const anyNonStartedGameFixture: NonStartedGame = NonStartedGameFixtures.any;

    return {
      ...anyNonStartedGameFixture,
      spec: {
        cards: [GameCardSpecFixtures.withAmount120],
        gameSlotsAmount: 2,
      },
      state: {
        ...anyNonStartedGameFixture.state,
        slots: [
          NonStartedGameSlotFixtures.withPositionZero,
          NonStartedGameSlotFixtures.withPositionOne,
        ],
      },
    };
  }

  public static get withGameSlotsAmountOneAndSlotsOne(): NonStartedGame {
    const anyNonStartedGameFixture: NonStartedGame = NonStartedGameFixtures.any;

    return {
      ...anyNonStartedGameFixture,
      spec: {
        ...anyNonStartedGameFixture.spec,
        gameSlotsAmount: 1,
      },
      state: {
        ...anyNonStartedGameFixture.state,
        slots: [NonStartedGameSlotFixtures.withPositionZero],
      },
    };
  }

  public static get withGameSlotsAmountOneAndSlotsZero(): NonStartedGame {
    const anyNonStartedGameFixture: NonStartedGame = NonStartedGameFixtures.any;

    return {
      ...anyNonStartedGameFixture,
      spec: {
        ...anyNonStartedGameFixture.spec,
        gameSlotsAmount: 1,
      },
      state: {
        ...anyNonStartedGameFixture.state,
        slots: [],
      },
    };
  }
}
