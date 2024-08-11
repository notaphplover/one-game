import { GameFindQuery } from '../query/GameFindQuery';
import { GameStatus } from '../valueObjects/GameStatus';
import { GameSlotFindQueryFixtures } from './GameSlotFindQueryFixtures';

export class GameFindQueryFixtures {
  public static get any(): GameFindQuery {
    return {};
  }

  public static get withId(): GameFindQuery {
    return {
      ...GameFindQueryFixtures.any,
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
    };
  }

  public static get withIsPublic(): GameFindQuery {
    return {
      ...GameFindQueryFixtures.any,
      isPublic: false,
    };
  }

  public static get withGameSlotFindQuery(): GameFindQuery {
    return {
      ...GameFindQueryFixtures.any,
      gameSlotFindQuery: GameSlotFindQueryFixtures.any,
    };
  }

  public static get withLimit(): GameFindQuery {
    return {
      ...GameFindQueryFixtures.any,
      limit: 10,
    };
  }

  public static get withOffset(): GameFindQuery {
    return {
      ...GameFindQueryFixtures.any,
      offset: 10,
    };
  }

  public static get withStateWithCurrentPlayingSlotIndex(): GameFindQuery {
    return {
      ...GameFindQueryFixtures.any,
      state: {
        currentPlayingSlotIndex: 1,
      },
    };
  }

  public static get withStatusActive(): GameFindQuery {
    return {
      ...GameFindQueryFixtures.any,
      status: GameStatus.active,
    };
  }
}
