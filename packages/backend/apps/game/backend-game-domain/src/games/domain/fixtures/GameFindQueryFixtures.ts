import { GameFindQuery } from '../query/GameFindQuery';

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
}
