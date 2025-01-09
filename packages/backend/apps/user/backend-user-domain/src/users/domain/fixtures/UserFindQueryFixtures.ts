import { UserFindQuery } from '../query/UserFindQuery';
import { UserFindQuerySortOption } from '../query/UserFindQuerySortOption';

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

  public static get withIdsOne(): UserFindQuery {
    const fixture: UserFindQuery = {
      ids: ['83073aec-b81b-4107-97f9-baa46de5dd40'],
    };

    return fixture;
  }

  public static get withIdsTwoAndSortIds(): UserFindQuery {
    const fixture: UserFindQuery = {
      ids: [
        '83073aec-b81b-4107-97f9-baa46de5dd40',
        '83073aec-b81b-4107-97f9-baa46de5dd41',
      ],
      sort: UserFindQuerySortOption.ids,
    };

    return fixture;
  }

  public static get withIdsTwo(): UserFindQuery {
    const fixture: UserFindQuery = {
      ids: [
        '83073aec-b81b-4107-97f9-baa46de5dd40',
        '83073aec-b81b-4107-97f9-baa46de5dd41',
      ],
    };

    return fixture;
  }

  public static get withLimit(): UserFindQuery {
    const fixture: UserFindQuery = {
      limit: 100,
    };

    return fixture;
  }

  public static get withNoProperties(): UserFindQuery {
    const fixture: UserFindQuery = {};

    return fixture;
  }

  public static get withOffset(): UserFindQuery {
    const fixture: UserFindQuery = {
      offset: 50,
    };

    return fixture;
  }

  public static get withNoIdsAndSortIds(): UserFindQuery {
    const fixture: UserFindQuery = {
      sort: UserFindQuerySortOption.ids,
    };

    return fixture;
  }
}
