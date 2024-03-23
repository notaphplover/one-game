import { GameActionFindQuery } from '../query/GameActionFindQuery';

export class GameActionFindQueryFixtures {
  public static get any(): GameActionFindQuery {
    return {};
  }

  public static get withId(): GameActionFindQuery {
    return {
      id: '16b54159-a4ef-41fc-994a-20709526bda0',
    };
  }
}
