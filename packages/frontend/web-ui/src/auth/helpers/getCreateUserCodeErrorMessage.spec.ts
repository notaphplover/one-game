import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppErrorKind } from '@cornie-js/frontend-common';

import {
  HTTP_CONFLICT_USERCODE_ERROR_MESSAGE,
  HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE,
  UNEXPECTED_USERCODE_ERROR_MESSAGE,
} from './createUserCodeErrorMessage';
import { getCreateUserCodeErrorMessage } from './getCreateUserCodeErrorMessage';

describe(getCreateUserCodeErrorMessage.name, () => {
  describe.each<[string, AppErrorKind | undefined, string]>([
    [
      'an entity conflict error kind',
      AppErrorKind.entityConflict,
      HTTP_CONFLICT_USERCODE_ERROR_MESSAGE,
    ],
    [
      'an unprocessable error kind',
      AppErrorKind.unprocessableOperation,
      HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE,
    ],
    ['an undefined', undefined, UNEXPECTED_USERCODE_ERROR_MESSAGE],
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
          result = getCreateUserCodeErrorMessage(errorKindFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
