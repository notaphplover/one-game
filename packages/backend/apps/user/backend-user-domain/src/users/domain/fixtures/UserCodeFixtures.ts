import { UserCode } from '../valueObjects/UserCode';
import { UserCodeKind } from '../valueObjects/UserCodeKind';

export class UserCodeFixtures {
  public static get any(): UserCode {
    const fixture: UserCode = {
      code: 'qwertyuiop',
      kind: UserCodeKind.registerConfirm,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };

    return fixture;
  }

  public static get withKindRegisterConfirm(): UserCode {
    const fixture: UserCode = {
      ...UserCodeFixtures.any,
      kind: UserCodeKind.registerConfirm,
    };

    return fixture;
  }

  public static get withKindResetPassword(): UserCode {
    const fixture: UserCode = {
      ...UserCodeFixtures.any,
      kind: UserCodeKind.resetPassword,
    };

    return fixture;
  }
}
