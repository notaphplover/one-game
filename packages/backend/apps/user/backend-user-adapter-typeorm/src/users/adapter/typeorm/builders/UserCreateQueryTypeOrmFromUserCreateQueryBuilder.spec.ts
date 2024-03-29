import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserCreateQuery } from '@cornie-js/backend-user-domain/users';
import { UserCreateQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserDb } from '../models/UserDb';
import { UserCreateQueryTypeOrmFromUserCreateQueryBuilder } from './UserCreateQueryTypeOrmFromUserCreateQueryBuilder';

describe(UserCreateQueryTypeOrmFromUserCreateQueryBuilder.name, () => {
  let userCreateQueryTypeOrmFromUserCreateQueryBuilder: UserCreateQueryTypeOrmFromUserCreateQueryBuilder;

  beforeAll(() => {
    userCreateQueryTypeOrmFromUserCreateQueryBuilder =
      new UserCreateQueryTypeOrmFromUserCreateQueryBuilder();
  });

  describe('when called', () => {
    let userCreateQueryFixture: UserCreateQuery;
    let result: unknown;

    beforeAll(() => {
      userCreateQueryFixture = UserCreateQueryFixtures.any;

      result = userCreateQueryTypeOrmFromUserCreateQueryBuilder.build(
        userCreateQueryFixture,
      );
    });

    it('should return a user', () => {
      const expected: QueryDeepPartialEntity<UserDb> = {
        active: userCreateQueryFixture.active,
        email: userCreateQueryFixture.email,
        id: userCreateQueryFixture.id,
        name: userCreateQueryFixture.name,
        passwordHash: userCreateQueryFixture.passwordHash,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
