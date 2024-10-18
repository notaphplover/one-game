import { beforeAll, describe, expect, it } from '@jest/globals';

import { PageName } from '../models/PageName';
import { getSlug } from './getSlug';

describe(getSlug.name, () => {
  describe.each<[PageName, string]>([
    [PageName.createGame, '/games/create'],
    [PageName.game, '/games'],
    [PageName.home, '/'],
    [PageName.login, '/auth/login'],
    [PageName.joinGame, '/games/join'],
    [PageName.publicGames, '/games/public'],
    [PageName.register, '/auth/register'],
    [PageName.userMe, '/users/me'],
    [PageName.forgot, '/auth/forgot'],
    [PageName.reset, '/auth/reset-password'],
  ])(
    'having a page name "%s"',
    (pageName: PageName, expectedResult: string) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = getSlug(pageName);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
