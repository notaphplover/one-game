import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UserFindQuerySortOption } from '@cornie-js/backend-user-domain/users';

import { UserFindQuerySortOptionFromUserSortOptionV1Builder } from './UserFindQuerySortOptionFromUserSortOptionV1Builder';

describe(UserFindQuerySortOptionFromUserSortOptionV1Builder.name, () => {
  let userFindQuerySortOptionFromUserSortOptionV1Builder: UserFindQuerySortOptionFromUserSortOptionV1Builder;

  beforeAll(() => {
    userFindQuerySortOptionFromUserSortOptionV1Builder =
      new UserFindQuerySortOptionFromUserSortOptionV1Builder();
  });

  describe.each<[apiModels.UserSortOptionV1, UserFindQuerySortOption]>([
    ['ids', UserFindQuerySortOption.ids],
  ])(
    'having a UserSortOptionV1 "%s"',
    (
      userSortOptionV1Fixture: apiModels.UserSortOptionV1,
      expected: UserFindQuerySortOption,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userFindQuerySortOptionFromUserSortOptionV1Builder.build(
            userSortOptionV1Fixture,
          );
        });

        it('should return UserFindQuerySortOption', () => {
          expect(result).toBe(expected);
        });
      });
    },
  );
});
