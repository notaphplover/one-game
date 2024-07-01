import {
  UserCodeFixtures,
  UserFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UserCodeCreatedEvent } from '../models/UserCodeCreatedEvent';

export class UserCodeCreatedEventFixtures {
  public static get any(): UserCodeCreatedEvent {
    return {
      user: UserFixtures.any,
      userCode: UserCodeFixtures.any,
    };
  }

  public static get withUserCodeWithKindRegisterConfirm(): UserCodeCreatedEvent {
    return {
      user: UserFixtures.any,
      userCode: UserCodeFixtures.withKindRegisterConfirm,
    };
  }

  public static get withUserCodeWithKindResetPassword(): UserCodeCreatedEvent {
    return {
      user: UserFixtures.any,
      userCode: UserCodeFixtures.withKindResetPassword,
    };
  }
}
