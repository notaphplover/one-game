import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserUpdateQueryFixtures } from '@cornie-js/backend-app-user-fixtures/user/domain';
import { UserUpdateQuery } from '@cornie-js/backend-app-user-models/domain';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserDb } from '../models/UserDb';
import { UserUpdateQueryToUserSetQueryTypeOrmConverter } from './UserUpdateQueryToUserSetQueryTypeOrmConverter';

describe(UserUpdateQueryToUserSetQueryTypeOrmConverter.name, () => {
  let userUpdateQueryToUserSetQueryTypeOrmConverter: UserUpdateQueryToUserSetQueryTypeOrmConverter;

  beforeAll(() => {
    userUpdateQueryToUserSetQueryTypeOrmConverter =
      new UserUpdateQueryToUserSetQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    describe('having a UserUpdateQuery with name', () => {
      let userUpdateQueryFixture: UserUpdateQuery;

      beforeAll(() => {
        userUpdateQueryFixture = UserUpdateQueryFixtures.withName;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userUpdateQueryToUserSetQueryTypeOrmConverter.convert(
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
  });
});
