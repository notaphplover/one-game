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
    ['a non object', AppErrorKind.contractViolation, false],
    ['a null value', null, false],
    [
      'an object with no kind',
      {
        message: 'message-fixture',
      },
      false,
    ],
    [
      'an object with invalid kind',
      {
        kind: 'kind-fixture',
        message: 'message-fixture',
      },
      false,
    ],
    [
      'an object with valid kind and no message',
      {
        kind: AppErrorKind.contractViolation,
      },
      false,
    ],
  ])(
    'having %s value',
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
