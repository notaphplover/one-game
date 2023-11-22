import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import {
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { UserUpdateQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { FindManyOptions } from 'typeorm';

import { UserDb } from '../models/UserDb';
import { UserFindQueryTypeOrmFromUserUpdateQueryBuilder } from './UserFindQueryTypeOrmFromUserUpdateQueryBuilder';

describe(UserFindQueryTypeOrmFromUserUpdateQueryBuilder.name, () => {
  let userFindQueryTypeOrmFromUserFindQueryBuilderMock: jest.Mocked<
    Builder<FindManyOptions<UserDb>, [UserFindQuery]>
  >;

  let userUpdateQueryToUserFindQueryTypeOrmConverter: UserFindQueryTypeOrmFromUserUpdateQueryBuilder;

  beforeAll(() => {
    userFindQueryTypeOrmFromUserFindQueryBuilderMock = {
      build: jest.fn(),
    };

    userUpdateQueryToUserFindQueryTypeOrmConverter =
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
      let userFindTypeOrmOptionsFixture: FindManyOptions<UserDb>;

      let result: unknown;

      beforeAll(() => {
        userFindTypeOrmOptionsFixture = {};

        userFindQueryTypeOrmFromUserFindQueryBuilderMock.build.mockReturnValueOnce(
          userFindTypeOrmOptionsFixture,
        );

        result = userUpdateQueryToUserFindQueryTypeOrmConverter.build(
          userUpdateQueryFixture,
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
        ).toHaveBeenCalledWith(userUpdateQueryFixture.userFindQuery);
      });

      it('should return a FindManyOptions<UserDb>', () => {
        expect(result).toBe(userFindTypeOrmOptionsFixture);
      });
    });
  });
});
