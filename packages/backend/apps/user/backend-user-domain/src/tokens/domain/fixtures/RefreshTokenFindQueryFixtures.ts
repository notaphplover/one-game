import { RefreshTokenFindQuery } from '../queries/RefreshTokenFindQuery';

export class RefreshTokenFindQueryFixtures {
  public static get any(): RefreshTokenFindQuery {
    return {
      id: 'f3073aec-b81b-4107-97f9-baa46de5d441',
    };
  }

  public static get withActive(): RefreshTokenFindQuery {
    return {
      active: true,
    };
  }

  public static get withDateFrom(): RefreshTokenFindQuery {
    return {
      date: {
        from: new Date(),
      },
    };
  }

  public static get withDateTo(): RefreshTokenFindQuery {
    return {
      date: {
        to: new Date(),
      },
    };
  }

  public static get withFamilyId(): RefreshTokenFindQuery {
    return {
      familyId: 'family-fixture',
    };
  }

  public static get withId(): RefreshTokenFindQuery {
    return {
      id: 'f3073aec-b81b-4107-97f9-baa46de5d441',
    };
  }

  public static get withLimit(): RefreshTokenFindQuery {
    return {
      limit: 10,
    };
  }

  public static get withOffset(): RefreshTokenFindQuery {
    return {
      offset: 10,
    };
  }
}
