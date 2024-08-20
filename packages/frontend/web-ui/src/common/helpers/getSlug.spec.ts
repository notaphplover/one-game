import { beforeAll, describe, expect, it } from '@jest/globals';

import { PageName } from '../models/PageName';
import { getSlug } from './getSlug';

describe(getSlug.name, () => {
  describe.each<[PageName, string]>([
    [PageName.createGame, '/games'],
    [PageName.login, '/auth/login'],
    [PageName.home, '/'],
    [PageName.register, '/auth/register'],
    [PageName.userMe, '/users/me'],
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
