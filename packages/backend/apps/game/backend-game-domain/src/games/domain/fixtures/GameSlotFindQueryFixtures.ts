import { GameSlotFindQuery } from '../query/GameSlotFindQuery';

export class GameSlotFindQueryFixtures {
  public static get any(): GameSlotFindQuery {
    return {};
  }

  public static get withGameId(): GameSlotFindQuery {
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

  public static get withUserId(): GameSlotFindQuery {
    return {
      ...GameSlotFindQueryFixtures.any,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }
}
