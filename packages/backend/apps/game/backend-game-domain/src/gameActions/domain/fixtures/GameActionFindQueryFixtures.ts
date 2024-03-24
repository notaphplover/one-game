import { GameActionFindQuery } from '../query/GameActionFindQuery';

export class GameActionFindQueryFixtures {
  public static get any(): GameActionFindQuery {
    return {};
  }

  public static get withGameId(): GameActionFindQuery {
    return {
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
    };
  }

  public static get withId(): GameActionFindQuery {
    return {
      id: '16b54159-a4ef-41fc-994a-20709526bda0',
    };
  }

  public static get withLimit(): GameActionFindQuery {
    return {
      limit: 10,
    };
  }

  public static get withPositionGt(): GameActionFindQuery {
    return {
      position: {
        gt: 1,
      },
    };
  }
}
