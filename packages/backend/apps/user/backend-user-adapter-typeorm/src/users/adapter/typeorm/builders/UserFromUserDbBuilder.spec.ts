import { beforeAll, describe, expect, it } from '@jest/globals';

import { User } from '@cornie-js/backend-user-domain/users';

import { UserDbFixtures } from '../fixtures/UserDbFixtures';
import { UserDb } from '../models/UserDb';
import { UserFromUserDbBuilder } from './UserFromUserDbBuilder';

describe(UserFromUserDbBuilder.name, () => {
  let userFromUserDbBuilder: UserFromUserDbBuilder;

  beforeAll(() => {
    userFromUserDbBuilder = new UserFromUserDbBuilder();
  });

  describe('when called', () => {
    let userDbFixture: UserDb;
    let result: unknown;

    beforeAll(() => {
      userDbFixture = UserDbFixtures.any;

      result = userFromUserDbBuilder.build(userDbFixture);
    });

    it('should return a user', () => {
      const expected: User = {
        active: userDbFixture.active,
        email: userDbFixture.email,
        id: userDbFixture.id,
        name: userDbFixture.name,
        passwordHash: userDbFixture.passwordHash,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
