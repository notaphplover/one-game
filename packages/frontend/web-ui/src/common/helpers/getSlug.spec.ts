import { beforeAll, describe, expect, it } from '@jest/globals';

import { NavbarPageName } from '../models/NavbarPageName';
import { getSlug } from './getSlug';

describe(getSlug.name, () => {
  describe.each<[NavbarPageName, string]>([
    [NavbarPageName.login, '/auth/login'],
    [NavbarPageName.logout, '/'],
    [NavbarPageName.register, '/auth/register'],
    [NavbarPageName.user, '/users/me'],
  ])(
    'having a page name "%s"',
    (pageName: NavbarPageName, expectedResult: string) => {
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
