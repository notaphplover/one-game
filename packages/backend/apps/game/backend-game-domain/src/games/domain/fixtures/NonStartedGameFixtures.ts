import { NonStartedGame } from '../entities/NonStartedGame';
import { GameStatus } from '../valueObjects/GameStatus';
import { NonStartedGameSlotFixtures } from './NonStartedGameSlotFixtures';

export class NonStartedGameFixtures {
  public static get any(): NonStartedGame {
    const fixture: NonStartedGame = {
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      name: 'Game name',
      state: {
        slots: [NonStartedGameSlotFixtures.withPositionZero],
        status: GameStatus.nonStarted,
      },
    };

    return fixture;
  }

  public static get withGameSlotsOne(): NonStartedGame {
    const anyNonStartedGameFixture: NonStartedGame = NonStartedGameFixtures.any;

    return {
      ...anyNonStartedGameFixture,
      state: {
        ...anyNonStartedGameFixture.state,
        slots: [NonStartedGameSlotFixtures.withPositionZero],
      },
    };
  }

  public static get withGameSlotsSlotsZero(): NonStartedGame {
    const anyNonStartedGameFixture: NonStartedGame = NonStartedGameFixtures.any;

    return {
      ...anyNonStartedGameFixture,
      state: {
        ...anyNonStartedGameFixture.state,
        slots: [],
      },
    };
  }
}
