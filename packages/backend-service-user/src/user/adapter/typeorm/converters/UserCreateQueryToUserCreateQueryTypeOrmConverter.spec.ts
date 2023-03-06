import { beforeAll, describe, expect, it } from '@jest/globals';

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCreateQueryFixtures } from '../../../domain/fixtures/UserCreateQueryFixtures';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
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
        id: userCreateQueryFixture.id,
        name: userCreateQueryFixture.name,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
