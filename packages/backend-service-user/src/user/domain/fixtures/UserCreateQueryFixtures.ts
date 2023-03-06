import { UserCreateQuery } from '../models/UserCreateQuery';

export class UserCreateQueryFixtures {
  public static get any(): UserCreateQuery {
    const fixture: UserCreateQuery = {
      id: '83073aec-b81b-4107-97f9-baa46de5dd40',
      name: 'Name',
    };

    return fixture;
  }
}
