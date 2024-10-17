import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppErrorKind } from '@cornie-js/frontend-common';

import { getUpdateUserMeErrorMessage } from './getUpdateUserMeErrorMessage';
import {
  HTTP_FORBIDDEN_UPD_USER_ME_ERROR_MESSAGE,
  HTTP_UNAUTHORIZED_UPD_USER_ME_ERROR_MESSAGE,
  UNEXPECTED_UPD_USER_ME_ERROR_MESSAGE,
} from './updateUserMeErrorMessage';

describe(getUpdateUserMeErrorMessage.name, () => {
  describe.each<[string, AppErrorKind | undefined, string]>([
    [
      'an unauthorized error kind',
      AppErrorKind.missingCredentials,
      HTTP_UNAUTHORIZED_UPD_USER_ME_ERROR_MESSAGE,
    ],
    [
      'a forbidden error kind',
      AppErrorKind.invalidCredentials,
      HTTP_FORBIDDEN_UPD_USER_ME_ERROR_MESSAGE,
    ],
    ['an undefined', undefined, UNEXPECTED_UPD_USER_ME_ERROR_MESSAGE],
  ])(
    'having %s value',
    (
      _: string,
      errorKindFixture: AppErrorKind | undefined,
      expectedResult: string,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = getUpdateUserMeErrorMessage(errorKindFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
