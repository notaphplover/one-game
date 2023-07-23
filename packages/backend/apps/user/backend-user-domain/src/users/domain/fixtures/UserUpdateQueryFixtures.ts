import { UserUpdateQuery } from '../query/UserUpdateQuery';
import { UserFindQueryFixtures } from './UserFindQueryFixtures';

export class UserUpdateQueryFixtures {
  public static get any(): UserUpdateQuery {
    return {
      userFindQuery: UserFindQueryFixtures.withId,
    };
  }

  public static get withActive(): UserUpdateQuery {
    return {
      ...UserUpdateQueryFixtures.any,
      active: true,
    };
  }

  public static get withName(): UserUpdateQuery {
    return {
      ...UserUpdateQueryFixtures.any,
      name: 'Name',
    };
  }
}
