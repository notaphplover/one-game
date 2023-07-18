import { Writable } from '@cornie-js/backend-common';

import { UserCodeDb } from '../models/UserCodeDb';

export class UserCodeDbFixtures {
  public static get any(): UserCodeDb {
    const fixture: UserCodeDb = new UserCodeDb();

    (fixture as Writable<UserCodeDb>).code = 'qwertyuiop';

    return fixture;
  }
}
