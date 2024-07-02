import { beforeAll, describe, expect, it } from '@jest/globals';

import { User } from '../entities/User';
import { UserCodeCreateQueryFixtures, UserFixtures } from '../fixtures';
import { UserCodeCreateQuery } from '../query/UserCodeCreateQuery';
import { UserCanCreateCodeSpec } from './UserCanCreateCodeSpec';

describe(UserCanCreateCodeSpec.name, () => {
  let userCanCreateCodeSpec: UserCanCreateCodeSpec;

  beforeAll(() => {
    userCanCreateCodeSpec = new UserCanCreateCodeSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe.each<[string, User, UserCodeCreateQuery, boolean]>([
      [
        'a user and a user code with different userId',
        UserFixtures.any,
        {
          ...UserCodeCreateQueryFixtures.any,
          id: 'sample-different-id',
        },
        false,
      ],
      [
        'a non active user and a registerConfirm user code',
        UserFixtures.withActiveFalse,
        UserCodeCreateQueryFixtures.withKindRegisterConfirm,
        true,
      ],
      [
        'an active user and a registerConfirm user code',
        UserFixtures.withActiveTrue,
        UserCodeCreateQueryFixtures.withKindRegisterConfirm,
        false,
      ],
      [
        'a non active user and a resetPassword user code',
        UserFixtures.withActiveFalse,
        UserCodeCreateQueryFixtures.withKindResetPassword,
        false,
      ],
      [
        'an active user and a resetPassword user code',
        UserFixtures.withActiveTrue,
        UserCodeCreateQueryFixtures.withKindResetPassword,
        true,
      ],
    ])(
      'having %s',
      (
        _: string,
        userFixture: User,
        userCodeCreateQueryFixture: UserCodeCreateQuery,
        expectedResult: boolean,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = userCanCreateCodeSpec.isSatisfiedBy(
              userFixture,
              userCodeCreateQueryFixture,
            );
          });

          it('should return expected result', () => {
            expect(result).toBe(expectedResult);
          });
        });
      },
    );
  });
});
