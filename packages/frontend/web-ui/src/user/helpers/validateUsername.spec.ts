import { beforeAll, describe, expect, it } from '@jest/globals';

import { Either } from '../../common/models/Either';
import { validateUsername } from './validateUsername';

describe(validateUsername.name, () => {
  describe.each<[string, Either<string, undefined>]>([
    [
      ' ',
      {
        isRight: false,
        value: 'Name is mandatory.',
      },
    ],
    [
      'username-fixture',
      {
        isRight: true,
        value: undefined,
      },
    ],
  ])(
    'having the username "%s"',
    (usernameFixture: string, expectedResult: Either<string, undefined>) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = validateUsername(usernameFixture);
        });

        it('should return expected value', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    },
  );
});
