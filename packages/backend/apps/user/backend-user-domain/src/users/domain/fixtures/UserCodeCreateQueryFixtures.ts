import { UserCodeCreateQuery } from '../query/UserCodeCreateQuery';

export class UserCodeCreateQueryFixtures {
  public static get any(): UserCodeCreateQuery {
    return {
      code: 'qwertyuiop',
      id: '13073aec-b81b-4107-97f9-baa46de5dd89',
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }
}
