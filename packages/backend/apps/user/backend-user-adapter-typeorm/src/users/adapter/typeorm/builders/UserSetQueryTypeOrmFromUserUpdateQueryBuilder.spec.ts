import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserUpdateQuery } from '@cornie-js/backend-user-domain/users';
import { UserUpdateQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserDb } from '../models/UserDb';
import { UserSetQueryTypeOrmFromUserUpdateQueryBuilder } from './UserSetQueryTypeOrmFromUserUpdateQueryBuilder';

describe(UserSetQueryTypeOrmFromUserUpdateQueryBuilder.name, () => {
  let userUpdateQueryToUserSetQueryTypeOrmBuilder: UserSetQueryTypeOrmFromUserUpdateQueryBuilder;

  beforeAll(() => {
    userUpdateQueryToUserSetQueryTypeOrmBuilder =
      new UserSetQueryTypeOrmFromUserUpdateQueryBuilder();
  });

  describe('.build', () => {
    describe('having a UserUpdateQuery with active', () => {
      let userUpdateQueryFixture: UserUpdateQuery;

      beforeAll(() => {
        userUpdateQueryFixture = UserUpdateQueryFixtures.withActive;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userUpdateQueryToUserSetQueryTypeOrmBuilder.build(
            userUpdateQueryFixture,
          );
        });

        it('should return a QueryDeepPartialEntity<UserDb>', () => {
          const expected: QueryDeepPartialEntity<UserDb> = {
            active: userUpdateQueryFixture.active as boolean,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a UserUpdateQuery with name', () => {
      let userUpdateQueryFixture: UserUpdateQuery;

      beforeAll(() => {
        userUpdateQueryFixture = UserUpdateQueryFixtures.withName;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userUpdateQueryToUserSetQueryTypeOrmBuilder.build(
            userUpdateQueryFixture,
          );
        });

        it('should return a QueryDeepPartialEntity<UserDb>', () => {
          const expected: QueryDeepPartialEntity<UserDb> = {
            name: userUpdateQueryFixture.name as string,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a UserUpdateQuery with passwordHash', () => {
      let userUpdateQueryFixture: UserUpdateQuery;

      beforeAll(() => {
        userUpdateQueryFixture = UserUpdateQueryFixtures.withPasswordHash;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userUpdateQueryToUserSetQueryTypeOrmBuilder.build(
            userUpdateQueryFixture,
          );
        });

        it('should return a QueryDeepPartialEntity<UserDb>', () => {
          const expected: QueryDeepPartialEntity<UserDb> = {
            passwordHash: userUpdateQueryFixture.passwordHash as string,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
