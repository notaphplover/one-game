import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UserCreateQuery } from '@cornie-js/backend-user-domain/users';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../foundation/hash/application/models/HashContext';
import { UserCreateQueryV1Fixtures } from '../fixtures/UserCreateQueryV1Fixtures';
import { UserCreateQueryFromUserCreateQueryV1Builder } from './UserCreateQueryFromUserCreateQueryV1Builder';

describe(UserCreateQueryFromUserCreateQueryV1Builder.name, () => {
  let userCreateQueryFromUserCreateQueryV1Builder: UserCreateQueryFromUserCreateQueryV1Builder;

  beforeAll(() => {
    userCreateQueryFromUserCreateQueryV1Builder =
      new UserCreateQueryFromUserCreateQueryV1Builder();
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
        result = userCreateQueryFromUserCreateQueryV1Builder.build(
          userCreateQueryV1Fixture,
          contextFixture,
        );
      });

      it('should return UserCreateQuery', () => {
        const expected: UserCreateQuery = {
          active: false,
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
