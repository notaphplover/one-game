import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { UserFindQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { FindManyOptions } from 'typeorm';

import { UserDb } from '../models/UserDb';
import { UserFindQueryToUserFindQueryTypeOrmConverter } from './UserFindQueryToUserFindQueryTypeOrmConverter';

describe(UserFindQueryToUserFindQueryTypeOrmConverter.name, () => {
  let userFindQueryToUserFindQueryTypeOrmConverter: UserFindQueryToUserFindQueryTypeOrmConverter;

  beforeAll(() => {
    userFindQueryToUserFindQueryTypeOrmConverter =
      new UserFindQueryToUserFindQueryTypeOrmConverter();
  });

  describe('having a UserFindQuery with no properties', () => {
    let userFindQueryFixture: UserFindQuery;

    beforeAll(() => {
      userFindQueryFixture = UserFindQueryFixtures.withNoProperties;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          userFindQueryToUserFindQueryTypeOrmConverter.convert(
            userFindQueryFixture,
          );
      });

      it('should return a FindManyOptions<UserDb>', () => {
        const expected: FindManyOptions<UserDb> = {
          where: {},
        };
        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a UserFindQuery with an email', () => {
    let userFindQueryFixture: UserFindQuery;

    beforeAll(() => {
      userFindQueryFixture = UserFindQueryFixtures.withEmail;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          userFindQueryToUserFindQueryTypeOrmConverter.convert(
            userFindQueryFixture,
          );
      });

      it('should return a FindManyOptions<UserDb>', () => {
        const expected: FindManyOptions<UserDb> = {
          where: {
            email: userFindQueryFixture.email as string,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a UserFindQuery with an id', () => {
    let userFindQueryFixture: UserFindQuery;

    beforeAll(() => {
      userFindQueryFixture = UserFindQueryFixtures.withId;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          userFindQueryToUserFindQueryTypeOrmConverter.convert(
            userFindQueryFixture,
          );
      });

      it('should return a FindManyOptions<UserDb>', () => {
        const expected: FindManyOptions<UserDb> = {
          where: {
            id: userFindQueryFixture.id as string,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
