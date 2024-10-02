import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppErrorKind } from '@cornie-js/frontend-common';

import {
  HTTP_BAD_REQUEST_USER_ERROR_MESSAGE,
  UNEXPECTED_USER_ERROR_MESSAGE,
} from './createUserErrorMessages';
import { getCreateUserErrorMessage } from './getCreateUserErrorMessage';

describe(getCreateUserErrorMessage.name, () => {
  describe.each<[string, AppErrorKind | undefined, string]>([
    [
      'an kind value',
      AppErrorKind.contractViolation,
      HTTP_BAD_REQUEST_USER_ERROR_MESSAGE,
    ],
    ['an undefined value', undefined, UNEXPECTED_USER_ERROR_MESSAGE],
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
          result = getCreateUserErrorMessage(errorKindFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
