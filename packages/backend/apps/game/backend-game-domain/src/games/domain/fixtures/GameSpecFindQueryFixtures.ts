import { GameSpecFindQuery } from '../query/GameSpecFindQuery';
import { GameSpecFindQuerySortOption } from '../query/GameSpecFindQuerySortOption';

export class GameSpecFindQueryFixtures {
  public static get any(): GameSpecFindQuery {
    return {};
  }

  public static get withGameIdsEmpty(): GameSpecFindQuery {
    return {
      gameIds: [],
    };
  }

  public static get withGameIdsWithLenghtOne(): GameSpecFindQuery {
    return {
      gameIds: ['game-id-fixture-1'],
    };
  }

  public static get withGameIdsWithLenghtTwo(): GameSpecFindQuery {
    return {
      gameIds: ['game-id-fixture-1', 'game-id-fixture-2'],
    };
  }

  public static get withGameIdsSortOptions(): GameSpecFindQuery {
    return {
      sort: GameSpecFindQuerySortOption.gameIds,
    };
  }

  public static get withGameIdsWithLenghtTwoAndGameIdsSortOptions(): GameSpecFindQuery {
    return {
      gameIds: ['game-id-fixture-1', 'game-id-fixture-2'],
      sort: GameSpecFindQuerySortOption.gameIds,
    };
  }

  public static get withLimit(): GameSpecFindQuery {
    return {
      limit: 10,
    };
  }

  public static get withOffset(): GameSpecFindQuery {
    return {
      offset: 10,
    };
  }
}
