import { UserCodeFindQuery } from '../query/UserCodeFindQuery';

export class UserCodeFindQueryFixtures {
  public static get any(): UserCodeFindQuery {
    return {};
  }

  public static get withCode(): UserCodeFindQuery {
    return { ...UserCodeFindQueryFixtures.any, code: 'qwertyuiop' };
  }
  public static get withUserId(): UserCodeFindQuery {
    return {
      ...UserCodeFindQueryFixtures.any,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }
}
