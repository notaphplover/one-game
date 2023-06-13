import { GameSlotFindQuery } from '@cornie-js/backend-app-game-domain/games/domain';

export class GameSlotFindQueryFixtures {
  public static get any(): GameSlotFindQuery {
    return {};
  }

  public static get withId(): GameSlotFindQuery {
    return {
      ...GameSlotFindQueryFixtures.any,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
    };
  }

  public static get withPosition(): GameSlotFindQuery {
    return {
      ...GameSlotFindQueryFixtures.any,
      position: 0,
    };
  }
}
