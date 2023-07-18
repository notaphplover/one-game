import { UserCode } from '../models/UserCode';

export class UserCodeFixtures {
  public static get any(): UserCode {
    const fixture: UserCode = {
      code: 'qwertyuiop',
    };

    return fixture;
  }
}
