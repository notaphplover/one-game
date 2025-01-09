import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import {
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { UserUpdateQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { UserDb } from '../models/UserDb';
import { UserFindQueryTypeOrmFromUserUpdateQueryBuilder } from './UserFindQueryTypeOrmFromUserUpdateQueryBuilder';

describe(UserFindQueryTypeOrmFromUserUpdateQueryBuilder.name, () => {
  let userFindQueryTypeOrmFromUserFindQueryBuilderMock: jest.Mocked<
    Builder<
      QueryBuilder<UserDb> & WhereExpressionBuilder,
      [UserFindQuery, QueryBuilder<UserDb> & WhereExpressionBuilder]
    >
  >;

  let userFindQueryTypeOrmFromUserUpdateQueryBuilder: UserFindQueryTypeOrmFromUserUpdateQueryBuilder;

  beforeAll(() => {
    userFindQueryTypeOrmFromUserFindQueryBuilderMock = {
      build: jest.fn(),
    };

    userFindQueryTypeOrmFromUserUpdateQueryBuilder =
      new UserFindQueryTypeOrmFromUserUpdateQueryBuilder(
        userFindQueryTypeOrmFromUserFindQueryBuilderMock,
      );
  });

  describe('having an UserUpdateQuery', () => {
    let userUpdateQueryFixture: UserUpdateQuery;

    beforeAll(() => {
      userUpdateQueryFixture = UserUpdateQueryFixtures.any;
    });

    describe('when called', () => {
      let queryBuilderFixture: QueryBuilder<UserDb> & WhereExpressionBuilder;

      let result: unknown;

      beforeAll(() => {
        queryBuilderFixture = Symbol() as unknown as QueryBuilder<UserDb> &
          WhereExpressionBuilder;

        userFindQueryTypeOrmFromUserFindQueryBuilderMock.build.mockReturnValueOnce(
          queryBuilderFixture,
        );

        result = userFindQueryTypeOrmFromUserUpdateQueryBuilder.build(
          userUpdateQueryFixture,
          queryBuilderFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userFindQueryTypeOrmFromUserFindQueryBuilder.build()', () => {
        expect(
          userFindQueryTypeOrmFromUserFindQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          userFindQueryTypeOrmFromUserFindQueryBuilderMock.build,
        ).toHaveBeenCalledWith(
          userUpdateQueryFixture.userFindQuery,
          queryBuilderFixture,
        );
      });

      it('should return QueryBuilder', () => {
        expect(result).toBe(queryBuilderFixture);
      });
    });
  });
});
