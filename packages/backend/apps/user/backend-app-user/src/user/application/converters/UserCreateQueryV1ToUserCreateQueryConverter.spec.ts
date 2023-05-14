import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UserCreateQuery } from '@cornie-js/backend-app-user-models/domain';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../foundation/hash/application/models/HashContext';
import { UserCreateQueryV1Fixtures } from '../fixtures/UserCreateQueryV1Fixtures';
import { UserCreateQueryV1ToUserCreateQueryConverter } from './UserCreateQueryV1ToUserCreateQueryConverter';

describe(UserCreateQueryV1ToUserCreateQueryConverter.name, () => {
  let userCreateQueryV1ToUserCreateQueryConverter: UserCreateQueryV1ToUserCreateQueryConverter;

  beforeAll(() => {
    userCreateQueryV1ToUserCreateQueryConverter =
      new UserCreateQueryV1ToUserCreateQueryConverter();
  });

  describe('.convert', () => {
    let userCreateQueryV1Fixture: apiModels.UserCreateQueryV1;
    let contextFixture: HashContext & UuidContext;

    beforeAll(() => {
      userCreateQueryV1Fixture = UserCreateQueryV1Fixtures.any;
      contextFixture = {
        hash: '$2y$10$/Q/7HB2eWCzGILadcebdf.8fvya0/cnYkPdgy4q63K3IGdlnpc.7K',
        uuid: '83073aec-b81b-4107-97f9-baa46de5dd40',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userCreateQueryV1ToUserCreateQueryConverter.convert(
          userCreateQueryV1Fixture,
          contextFixture,
        );
      });

      it('should return UserCreateQuery', () => {
        const expected: UserCreateQuery = {
          email: userCreateQueryV1Fixture.email,
          id: contextFixture.uuid,
          name: userCreateQueryV1Fixture.name,
          passwordHash: contextFixture.hash,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
