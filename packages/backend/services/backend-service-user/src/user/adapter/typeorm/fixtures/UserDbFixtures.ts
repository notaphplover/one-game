import { Writable } from '../../../../foundation/common/application/models/Writable';
import { UserDb } from '../models/UserDb';

export class UserDbFixtures {
  public static get any(): UserDb {
    const fixture: UserDb = new UserDb();

    (fixture as Writable<UserDb>).id = '83073aec-b81b-4107-97f9-baa46de5dd40';
    (fixture as Writable<UserDb>).name = 'Name';

    return fixture;
  }
}
