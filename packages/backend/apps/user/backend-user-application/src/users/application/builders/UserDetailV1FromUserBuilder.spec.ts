import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { User } from '@cornie-js/backend-user-domain/users';
import { UserFixtures } from '@cornie-js/backend-user-domain/users/fixtures';

import { UserDetailV1FromUserBuilder } from './UserDetailV1FromUserBuilder';

describe(UserDetailV1FromUserBuilder.name, () => {
  let userDetailV1FromUserBuilder: UserDetailV1FromUserBuilder;

  beforeAll(() => {
    userDetailV1FromUserBuilder = new UserDetailV1FromUserBuilder();
  });

  describe('.build', () => {
    let userFixture: User;

    beforeAll(() => {
      userFixture = UserFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userDetailV1FromUserBuilder.build(userFixture);
      });

      it('should return UserDetailV1', () => {
        const expected: apiModels.UserDetailV1 = {
          email: userFixture.email,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
