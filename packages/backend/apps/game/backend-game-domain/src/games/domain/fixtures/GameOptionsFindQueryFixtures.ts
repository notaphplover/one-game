import { GameOptionsFindQuery } from '../query/GameOptionsFindQuery';

export class GameOptionsFindQueryFixtures {
  public static get any(): GameOptionsFindQuery {
    return {};
  }

  public static get withGameId(): GameOptionsFindQuery {
    return {
      ...GameOptionsFindQueryFixtures.any,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
    };
  }
}
