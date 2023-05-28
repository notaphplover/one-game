import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UserUpdateQueryFixtures } from '@cornie-js/backend-app-user-fixtures/user/domain';
import {
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-app-user-models/domain';
import { Converter } from '@cornie-js/backend-common';
import { FindManyOptions } from 'typeorm';

import { UserDb } from '../models/UserDb';
import { UserUpdateQueryToUserFindQueryTypeOrmConverter } from './UserUpdateQueryToUserFindQueryTypeOrmConverter';

describe(UserUpdateQueryToUserFindQueryTypeOrmConverter.name, () => {
  let userFindQueryToUserFindQueryTypeOrmConverterMock: jest.Mocked<
    Converter<UserFindQuery, FindManyOptions<UserDb>>
  >;

  let userUpdateQueryToUserFindQueryTypeOrmConverter: UserUpdateQueryToUserFindQueryTypeOrmConverter;

  beforeAll(() => {
    userFindQueryToUserFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    userUpdateQueryToUserFindQueryTypeOrmConverter =
      new UserUpdateQueryToUserFindQueryTypeOrmConverter(
        userFindQueryToUserFindQueryTypeOrmConverterMock,
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

        userFindQueryToUserFindQueryTypeOrmConverterMock.convert.mockReturnValueOnce(
          userFindTypeOrmOptionsFixture,
        );

        result = userUpdateQueryToUserFindQueryTypeOrmConverter.convert(
          userUpdateQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call UserFindQueryToUserFindQueryTypeOrmConverter.convert()', () => {
        expect(
          userFindQueryToUserFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          userFindQueryToUserFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(userUpdateQueryFixture.userFindQuery);
      });

      it('should return a FindManyOptions<UserDb>', () => {
        expect(result).toBe(userFindTypeOrmOptionsFixture);
      });
    });
  });
});
