import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { User } from '@cornie-js/backend-user-domain/users';
import { UserFixtures } from '@cornie-js/backend-user-domain/users/fixtures';

import { UserV1FromUserBuilder } from './UserV1FromUserBuilder';

describe(UserV1FromUserBuilder.name, () => {
  let userV1FromUserBuilder: UserV1FromUserBuilder;

  beforeAll(() => {
    userV1FromUserBuilder = new UserV1FromUserBuilder();
  });

  describe('.convert', () => {
    let userFixture: User;

    beforeAll(() => {
      userFixture = UserFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userV1FromUserBuilder.build(userFixture);
      });

      it('should return a UserV1', () => {
        const expected: apiModels.UserV1 = {
          active: userFixture.active,
          id: userFixture.id,
          name: userFixture.name,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
