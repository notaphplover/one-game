import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserCode, UserCodeKind } from '@cornie-js/backend-user-domain/users';

import { UserCodeDbFixtures } from '../fixtures/UserCodeDbFixtures';
import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeFromUserDbCodeBuilder } from './UserCodeFromUserCodeDbBuilder';

describe(UserCodeFromUserDbCodeBuilder.name, () => {
  let userCodeFromUserCodeDbBuilder: UserCodeFromUserDbCodeBuilder;

  beforeAll(() => {
    userCodeFromUserCodeDbBuilder = new UserCodeFromUserDbCodeBuilder();
  });

  describe('.build', () => {
    let userCodeDbFixture: UserCodeDb;

    beforeAll(() => {
      userCodeDbFixture = UserCodeDbFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userCodeFromUserCodeDbBuilder.build(userCodeDbFixture);
      });

      it('should return a UserCode', () => {
        const expected: UserCode = {
          code: userCodeDbFixture.code,
          kind: UserCodeKind.registerConfirm,
          userId: userCodeDbFixture.userId,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
