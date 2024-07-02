import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UserCodeKind } from '@cornie-js/backend-user-domain/users';

import { UserCodeKindFromUserCodeKindV1Builder } from './UserCodeKindFromUserCodeKindV1Builder';

describe(UserCodeKindFromUserCodeKindV1Builder.name, () => {
  let userCodeKindFromUserCodeKindV1Builder: UserCodeKindFromUserCodeKindV1Builder;

  beforeAll(() => {
    userCodeKindFromUserCodeKindV1Builder =
      new UserCodeKindFromUserCodeKindV1Builder();
  });

  describe('.build', () => {
    describe.each<[apiModels.UserCodeKindV1, UserCodeKind]>([
      ['registerConfirm', UserCodeKind.registerConfirm],
      ['resetPassword', UserCodeKind.resetPassword],
    ])(
      'having a UserCodeKindV1 of type "%s"',
      (
        usercodeKindV1Fixture: apiModels.UserCodeKindV1,
        expectedUserCodeKind: UserCodeKind,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = userCodeKindFromUserCodeKindV1Builder.build(
              usercodeKindV1Fixture,
            );
          });

          it('should return expected UserCodeKind', () => {
            expect(result).toBe(expectedUserCodeKind);
          });
        });
      },
    );
  });
});
