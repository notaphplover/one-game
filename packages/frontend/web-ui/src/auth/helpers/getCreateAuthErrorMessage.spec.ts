import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppErrorKind } from '@cornie-js/frontend-common';

import {
  HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE,
  UNEXPECTED_AUTH_ERROR_MESSAGE,
} from './createAuthErrorMessages';
import { getCreateAuthErrorMessage } from './getCreateAuthErrorMessage';

describe(getCreateAuthErrorMessage.name, () => {
  describe.each<[string, AppErrorKind | undefined, string]>([
    [
      'an kind value',
      AppErrorKind.missingCredentials,
      HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE,
    ],
    ['an undefined value', undefined, UNEXPECTED_AUTH_ERROR_MESSAGE],
  ])(
    'having %s error',
    (
      _: string,
      errorKindFixture: AppErrorKind | undefined,
      expectedResult: string,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = getCreateAuthErrorMessage(errorKindFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
