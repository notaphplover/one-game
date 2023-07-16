import { UserFindQuery } from '../query/UserFindQuery';

export class UserFindQueryFixtures {
  public static get withEmail(): UserFindQuery {
    const fixture: UserFindQuery = {
      email: 'mail@sample.com',
    };

    return fixture;
  }

  public static get withId(): UserFindQuery {
    const fixture: UserFindQuery = {
      id: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };

    return fixture;
  }

  public static get withNoProperties(): UserFindQuery {
    const fixture: UserFindQuery = {};

    return fixture;
  }
}
