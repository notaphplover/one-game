import { beforeAll, describe, expect, it } from '@jest/globals';

import { User } from '../../../domain/models/User';
import { UserDbFixtures } from '../fixtures/UserDbFixtures';
import { UserDb } from '../models/UserDb';
import { UserDbToUserConverter } from './UserDbToUserConverter';

describe(UserDbToUserConverter.name, () => {
  let userDbToUserConverter: UserDbToUserConverter;

  beforeAll(() => {
    userDbToUserConverter = new UserDbToUserConverter();
  });

  describe('when called', () => {
    let userDbFixture: UserDb;
    let result: unknown;

    beforeAll(() => {
      userDbFixture = UserDbFixtures.any;

      result = userDbToUserConverter.convert(userDbFixture);
    });

    it('should return a user', () => {
      const expected: User = {
        email: userDbFixture.email,
        id: userDbFixture.id,
        name: userDbFixture.name,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
