import { UserUpdateQuery } from '@cornie-js/backend-app-user-models/domain';

import { UserFindQueryFixtures } from './UserFindQueryFixtures';

export class UserUpdateQueryFixtures {
  public static get any(): UserUpdateQuery {
    return {
      userFindQuery: UserFindQueryFixtures.withId,
    };
  }

  public static get withName(): UserUpdateQuery {
    return {
      ...UserUpdateQueryFixtures.any,
      name: 'Name',
    };
  }
}
