import { Writable } from '@cornie-js/backend-common';

import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeKindDb } from '../models/UserCodeKindDb';

export class UserCodeDbFixtures {
  public static get any(): UserCodeDb {
    const fixture: UserCodeDb = new UserCodeDb();

    (fixture as Writable<UserCodeDb>).code = 'qwertyuiop';
    (fixture as Writable<UserCodeDb>).kind = null;

    return fixture;
  }

  public static get withKindNull(): UserCodeDb {
    const fixture: UserCodeDb = UserCodeDbFixtures.any;

    (fixture as Writable<UserCodeDb>).kind = null;

    return fixture;
  }

  public static get withKindResetPassword(): UserCodeDb {
    const fixture: UserCodeDb = UserCodeDbFixtures.any;

    (fixture as Writable<UserCodeDb>).kind = UserCodeKindDb.resetPassword;

    return fixture;
  }
}
