import { beforeAll, describe, expect, it } from '@jest/globals';

import {
  User,
  UserCodeCreateQuery,
  UserCodeKind,
} from '@cornie-js/backend-user-domain/users';
import { UserFixtures } from '@cornie-js/backend-user-domain/users/fixtures';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { UserCodeContext } from '../models/UserCodeContext';
import { UserCodeCreateQueryFromUserBuilder } from './UserCodeCreateQueryFromUserBuilder';

describe(UserCodeCreateQueryFromUserBuilder.name, () => {
  let userCodeCreateQueryFromUserBuilder: UserCodeCreateQueryFromUserBuilder;

  beforeAll(() => {
    userCodeCreateQueryFromUserBuilder =
      new UserCodeCreateQueryFromUserBuilder();
  });

  describe('.build', () => {
    let userFixture: User;
    let contextFixture: UserCodeContext & UuidContext;

    beforeAll(() => {
      userFixture = UserFixtures.any;
      contextFixture = {
        kind: UserCodeKind.resetPassword,
        userCode: 'code fixture',
        uuid: 'uuid fixture',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userCodeCreateQueryFromUserBuilder.build(
          userFixture,
          contextFixture,
        );
      });

      it('should return a UserCodeCreateQuery', () => {
        const expected: UserCodeCreateQuery = {
          code: contextFixture.userCode,
          id: contextFixture.uuid,
          kind: contextFixture.kind,
          userId: userFixture.id,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
