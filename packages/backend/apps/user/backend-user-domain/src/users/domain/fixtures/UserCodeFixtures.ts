import { UserCode } from '../models/UserCode';

export class UserCodeFixtures {
  public static get any(): UserCode {
    const fixture: UserCode = {
      code: 'qwertyuiop',
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };

    return fixture;
  }
}
