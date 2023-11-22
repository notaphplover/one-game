import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserCodeFindQuery } from '@cornie-js/backend-user-domain/users';
import { UserCodeFindQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { FindManyOptions } from 'typeorm';

import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder } from './UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder';

describe(UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder.name, () => {
  let userCodeFindQueryToUserCodeFindQueryTypeOrmConverter: UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder;

  beforeAll(() => {
    userCodeFindQueryToUserCodeFindQueryTypeOrmConverter =
      new UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder();
  });

  describe('.convert', () => {
    describe('having a UserCodeFindQuery with code', () => {
      let userCodeFindQueryFixture: UserCodeFindQuery;

      beforeAll(() => {
        userCodeFindQueryFixture = UserCodeFindQueryFixtures.withCode;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userCodeFindQueryToUserCodeFindQueryTypeOrmConverter.build(
            userCodeFindQueryFixture,
          );
        });

        it('should return a FindManyOptions<UserCodeDb>', () => {
          const expected: FindManyOptions<UserCodeDb> = {
            where: {
              code: userCodeFindQueryFixture.code as string,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a UserCodeFindQuery with userId', () => {
      let userCodeFindQueryFixture: UserCodeFindQuery;

      beforeAll(() => {
        userCodeFindQueryFixture = UserCodeFindQueryFixtures.withUserId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userCodeFindQueryToUserCodeFindQueryTypeOrmConverter.build(
            userCodeFindQueryFixture,
          );
        });

        it('should return a FindManyOptions<UserCodeDb>', () => {
          const expected: FindManyOptions<UserCodeDb> = {
            where: {
              user: {
                id: userCodeFindQueryFixture.userId as string,
              },
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
