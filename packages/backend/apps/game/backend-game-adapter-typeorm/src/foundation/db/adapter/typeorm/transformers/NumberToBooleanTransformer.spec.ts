import { beforeAll, describe, expect, it } from '@jest/globals';

import { NumberToBooleanTransformer } from './NumberToBooleanTransformer';

describe(NumberToBooleanTransformer.name, () => {
  let numberToBooleanTransformer: NumberToBooleanTransformer;

  beforeAll(() => {
    numberToBooleanTransformer = new NumberToBooleanTransformer();
  });

  describe('.from', () => {
    describe.each<[string, number, boolean]>([
      ['1', 1, true],
      ['0', 0, false],
    ])(
      'having the value "%s"',
      (_: string, value: number, expectedValue: boolean) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = numberToBooleanTransformer.from(value);
          });

          it('should return boolean', () => {
            expect(result).toBe(expectedValue);
          });
        });
      },
    );
  });

  describe('.to', () => {
    describe.each<[string, boolean, number]>([
      ['1', true, 1],
      ['0', false, 0],
    ])(
      'having the value "%s"',
      (_: string, value: boolean, expectedValue: number) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = numberToBooleanTransformer.to(value);
          });

          it('should return number', () => {
            expect(result).toBe(expectedValue);
          });
        });
      },
    );
  });
});
