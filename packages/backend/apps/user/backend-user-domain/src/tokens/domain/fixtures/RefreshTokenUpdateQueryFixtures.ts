import { RefreshTokenUpdateQuery } from '../queries/RefreshTokenUpdateQuery';
import { RefreshTokenFindQueryFixtures } from './RefreshTokenFindQueryFixtures';

export class RefreshTokenUpdateQueryFixtures {
  public static get any(): RefreshTokenUpdateQuery {
    return {
      findQuery: RefreshTokenFindQueryFixtures.any,
    };
  }

  public static get withActive(): RefreshTokenUpdateQuery {
    return {
      ...RefreshTokenUpdateQueryFixtures.any,
      active: true,
    };
  }
}
