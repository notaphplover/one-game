import { UserCodeCreateQuery } from '../query/UserCodeCreateQuery';
import { UserCodeKind } from '../valueObjects/UserCodeKind';

export class UserCodeCreateQueryFixtures {
  public static get any(): UserCodeCreateQuery {
    return {
      code: 'qwertyuiop',
      id: '13073aec-b81b-4107-97f9-baa46de5dd89',
      kind: UserCodeKind.registerConfirm,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }
}
