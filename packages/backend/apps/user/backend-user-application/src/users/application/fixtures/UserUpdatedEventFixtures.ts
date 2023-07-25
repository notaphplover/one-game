import {
  UserFixtures,
  UserUpdateQueryFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UserUpdatedEvent } from '../models/UserUpdatedEvent';

export class UserUpdatedEventFixtures {
  public static get any(): UserUpdatedEvent {
    return {
      userBeforeUpdate: UserFixtures.any,
      userUpdateQuery: UserUpdateQueryFixtures.any,
    };
  }

  public static get withUserBeforeUpdateActive(): UserUpdatedEvent {
    return {
      ...UserUpdatedEventFixtures.any,
      userBeforeUpdate: UserFixtures.withActiveTrue,
    };
  }

  public static get withUserUpdateQueryWithNoActive(): UserUpdatedEvent {
    return {
      ...UserUpdatedEventFixtures.any,
      userUpdateQuery: UserUpdateQueryFixtures.withNoActive,
    };
  }

  public static get withUserBeforeUpdateActiveFalseAndUserUpdateQueryWithActive(): UserUpdatedEvent {
    return {
      userBeforeUpdate: UserFixtures.withActiveFalse,
      userUpdateQuery: UserUpdateQueryFixtures.withActive,
    };
  }
}
