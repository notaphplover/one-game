import { NonStartedGame } from '@cornie-js/backend-app-game-models/games/domain';

import { GameCardSpecFixtures } from './GameCardSpecFixtures';
import { NonStartedGameSlotFixtures } from './NonStartedGameSlotFixtures';

export class NonStartedGameFixtures {
  public static get any(): NonStartedGame {
    const fixture: NonStartedGame = {
      deck: [],
      gameSlotsAmount: 1,
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      spec: {
        cards: [GameCardSpecFixtures.any],
      },
      state: {
        active: false,
        slots: [NonStartedGameSlotFixtures.withPositionZero],
      },
    };

    return fixture;
  }

  public static get withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount0(): NonStartedGame {
    const anyNonStartedGameFixture: NonStartedGame = NonStartedGameFixtures.any;

    return {
      ...anyNonStartedGameFixture,
      deck: [GameCardSpecFixtures.withAmount0],
      gameSlotsAmount: 2,
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
      deck: [GameCardSpecFixtures.withAmount120],
      gameSlotsAmount: 2,
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
      gameSlotsAmount: 1,
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
      gameSlotsAmount: 1,
      state: {
        ...anyNonStartedGameFixture.state,
        slots: [],
      },
    };
  }
}
