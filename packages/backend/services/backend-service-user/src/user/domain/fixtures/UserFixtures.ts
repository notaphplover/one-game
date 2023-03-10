import { User } from '../models/User';

export class UserFixtures {
  public static get any(): User {
    const fixture: User = {
      email: 'mail@sample.com',
      id: '83073aec-b81b-4107-97f9-baa46de5dd40',
      name: 'Name',
    };

    return fixture;
  }
}
