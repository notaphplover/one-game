import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserCodeKind } from '@cornie-js/backend-user-domain/users';

import { UserCodeKindDb } from '../models/UserCodeKindDb';
import { UserCodeKindFromUserCodeKindDbBuilder } from './UserCodeKindFromUserCodeKindDbBuilder';

describe(UserCodeKindFromUserCodeKindDbBuilder.name, () => {
  let userCodeKindFromUserCodeKindDbBuilder: UserCodeKindFromUserCodeKindDbBuilder;

  beforeAll(() => {
    userCodeKindFromUserCodeKindDbBuilder =
      new UserCodeKindFromUserCodeKindDbBuilder();
  });

  describe.each<[string, UserCodeKindDb, UserCodeKind]>([
    [
      'registerConfirm',
      UserCodeKindDb.registerConfirm,
      UserCodeKind.registerConfirm,
    ],
    ['resetPassword', UserCodeKindDb.resetPassword, UserCodeKind.resetPassword],
  ])(
    'having a UserCodeKind "%s"',
    (
      _: string,
      userCodeKindDbFixture: UserCodeKindDb,
      expectedUserCodeKind: UserCodeKind,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userCodeKindFromUserCodeKindDbBuilder.build(
            userCodeKindDbFixture,
          );
        });

        it('should return UserCodeKindDb', () => {
          expect(result).toBe(expectedUserCodeKind);
        });
      });
    },
  );
});
