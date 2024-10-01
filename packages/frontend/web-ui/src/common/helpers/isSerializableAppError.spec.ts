import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppErrorKind } from '@cornie-js/frontend-common';

import { isSerializableAppError } from './isSerializableAppError';

describe(isSerializableAppError.name, () => {
  describe.each<[string, unknown, boolean]>([
    [
      'a SerializableAppError',
      {
        kind: AppErrorKind.contractViolation,
        message: 'message-fixture',
      },
      true,
    ],
    [
      'a SerializedError',
      {
        code: 'code-fixture',
        message: 'message-fixture',
        name: 'name-fixture',
        stack: 'stack-fixture',
      },
      false,
    ],
    ['a non object', {}, false],
  ])(
    'having %s error',
    (_: string, errorFixture: unknown, expectedResult: boolean) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isSerializableAppError(errorFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
