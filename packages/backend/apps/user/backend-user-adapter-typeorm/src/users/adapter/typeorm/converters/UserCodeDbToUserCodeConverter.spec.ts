import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserCode } from '@cornie-js/backend-user-domain/users';

import { UserCodeDbFixtures } from '../fixtures/UserCodeDbFixtures';
import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeDbToUserCodeConverter } from './UserCodeDbToUserCodeConverter';

describe(UserCodeDbToUserCodeConverter.name, () => {
  let userCodeDbToUserCodeConverter: UserCodeDbToUserCodeConverter;

  beforeAll(() => {
    userCodeDbToUserCodeConverter = new UserCodeDbToUserCodeConverter();
  });

  describe('.convert', () => {
    let userCodeDbFixture: UserCodeDb;

    beforeAll(() => {
      userCodeDbFixture = UserCodeDbFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userCodeDbToUserCodeConverter.convert(userCodeDbFixture);
      });

      it('should return a UserCode', () => {
        const expected: UserCode = {
          code: userCodeDbFixture.code,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
