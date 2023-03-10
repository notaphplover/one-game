import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';

import { UserFixtures } from '../../domain/fixtures/UserFixtures';
import { User } from '../../domain/models/User';
import { UserToUserV1Converter } from './UserToUserV1Converter';

describe(UserToUserV1Converter.name, () => {
  let userToUserV1Converter: UserToUserV1Converter;

  beforeAll(() => {
    userToUserV1Converter = new UserToUserV1Converter();
  });

  describe('.convert', () => {
    let userFixture: User;

    beforeAll(() => {
      userFixture = UserFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userToUserV1Converter.convert(userFixture);
      });

      it('should return a UserV1', () => {
        const expected: apiModels.UserV1 = {
          id: userFixture.id,
          name: userFixture.name,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
