import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserCodeCreateQuery } from '@cornie-js/backend-user-domain/users';
import { UserCodeCreateQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter } from './UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter';

describe(UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter.name, () => {
  let userCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter: UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter;

  beforeAll(() => {
    userCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter =
      new UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    let userCodeCreateQueryFixture: UserCodeCreateQuery;

    beforeAll(() => {
      userCodeCreateQueryFixture = UserCodeCreateQueryFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          userCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter.convert(
            userCodeCreateQueryFixture,
          );
      });

      it('should return a QueryDeepPartial<UserCodeDb>', () => {
        const expected: QueryDeepPartialEntity<UserCodeDb> = {
          code: userCodeCreateQueryFixture.code,
          id: userCodeCreateQueryFixture.id,
          user: {
            id: userCodeCreateQueryFixture.userId,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
