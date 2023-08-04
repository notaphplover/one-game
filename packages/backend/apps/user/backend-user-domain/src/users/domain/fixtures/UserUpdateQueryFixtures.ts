import { Writable } from '@cornie-js/backend-common';

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

  public static get withNoActive(): UserUpdateQuery {
    const fixture: UserUpdateQuery = UserUpdateQueryFixtures.any;

    delete (fixture as Writable<UserUpdateQuery>).active;

    return fixture;
  }

  public static get withName(): UserUpdateQuery {
    return {
      ...UserUpdateQueryFixtures.any,
      name: 'Name',
    };
  }

  public static get withNameEmpty(): UserUpdateQuery {
    return {
      ...UserUpdateQueryFixtures.any,
      name: '',
    };
  }
}
