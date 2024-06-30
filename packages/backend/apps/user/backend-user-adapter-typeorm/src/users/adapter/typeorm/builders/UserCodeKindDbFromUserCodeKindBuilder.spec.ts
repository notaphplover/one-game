import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserCodeKind } from '@cornie-js/backend-user-domain/users';

import { UserCodeKindDb } from '../models/UserCodeKindDb';
import { UserCodeKindDbFromUserCodeKindBuilder } from './UserCodeKindDbFromUserCodeKindBuilder';

describe(UserCodeKindDbFromUserCodeKindBuilder.name, () => {
  let userCodeKindDbFromUserCodeKindBuilder: UserCodeKindDbFromUserCodeKindBuilder;

  beforeAll(() => {
    userCodeKindDbFromUserCodeKindBuilder =
      new UserCodeKindDbFromUserCodeKindBuilder();
  });

  describe.each<[string, UserCodeKind, UserCodeKindDb]>([
    [
      'registerConfirm',
      UserCodeKind.registerConfirm,
      UserCodeKindDb.registerConfirm,
    ],
    ['resetPassword', UserCodeKind.resetPassword, UserCodeKindDb.resetPassword],
  ])(
    'having a UserCodeKind "%s"',
    (
      _: string,
      userCodeKindFixture: UserCodeKind,
      expectedUserCodeKindDb: UserCodeKindDb,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            userCodeKindDbFromUserCodeKindBuilder.build(userCodeKindFixture);
        });

        it('should return UserCodeKindDb', () => {
          expect(result).toBe(expectedUserCodeKindDb);
        });
      });
    },
  );
});
