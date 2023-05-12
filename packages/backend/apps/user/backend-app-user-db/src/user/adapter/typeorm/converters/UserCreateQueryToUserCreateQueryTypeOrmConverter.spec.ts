import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserCreateQueryFixtures } from '@cornie-js/backend-app-user-fixtures';
import { UserCreateQuery } from '@cornie-js/backend-app-user-models';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserDb } from '../models/UserDb';
import { UserCreateQueryToUserCreateQueryTypeOrmConverter } from './UserCreateQueryToUserCreateQueryTypeOrmConverter';

describe(UserCreateQueryToUserCreateQueryTypeOrmConverter.name, () => {
  let userCreateQueryToUserCreateQueryTypeOrmConverter: UserCreateQueryToUserCreateQueryTypeOrmConverter;

  beforeAll(() => {
    userCreateQueryToUserCreateQueryTypeOrmConverter =
      new UserCreateQueryToUserCreateQueryTypeOrmConverter();
  });

  describe('when called', () => {
    let userCreateQueryFixture: UserCreateQuery;
    let result: unknown;

    beforeAll(() => {
      userCreateQueryFixture = UserCreateQueryFixtures.any;

      result = userCreateQueryToUserCreateQueryTypeOrmConverter.convert(
        userCreateQueryFixture,
      );
    });

    it('should return a user', () => {
      const expected: QueryDeepPartialEntity<UserDb> = {
        email: userCreateQueryFixture.email,
        id: userCreateQueryFixture.id,
        name: userCreateQueryFixture.name,
        passwordHash: userCreateQueryFixture.passwordHash,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
