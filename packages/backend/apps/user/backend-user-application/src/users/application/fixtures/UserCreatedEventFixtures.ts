import {
  UserCreateQueryFixtures,
  UserFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UserCreatedEvent } from '../models/UserCreatedEvent';

export class UserCreatedEventFixtures {
  public static get any(): UserCreatedEvent {
    return {
      user: UserFixtures.any,
      userCreateQuery: UserCreateQueryFixtures.any,
    };
  }
}
