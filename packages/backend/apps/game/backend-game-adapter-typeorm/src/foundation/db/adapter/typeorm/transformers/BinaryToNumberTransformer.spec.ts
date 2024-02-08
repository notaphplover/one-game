import { beforeAll, describe, expect, it } from '@jest/globals';

import { BinaryToNumberTransformer } from './BinaryToNumberTransformer';

describe(BinaryToNumberTransformer.name, () => {
  let sizeFixture: number;

  let binaryToNumberTransformer: BinaryToNumberTransformer;

  beforeAll(() => {
    sizeFixture = 8;

    binaryToNumberTransformer = new BinaryToNumberTransformer(sizeFixture);
  });

  describe('.from', () => {
    describe.each<[string, string | null, number | null]>([
      ['null', null, null],
      ['00000010', '00000010', 2],
    ])(
      'having the value "%s"',
      (_: string, value: string | null, expectedValue: number | null) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = binaryToNumberTransformer.from(value);
          });

          it('should return number | null', () => {
            expect(result).toBe(expectedValue);
          });
        });
      },
    );
  });

  describe('.to', () => {
    describe.each<[string, number | null, string | null]>([
      ['null', null, null],
      ['2', 2, '00000010'],
    ])(
      'having the value "%s"',
      (_: string, value: number | null, expectedValue: string | null) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = binaryToNumberTransformer.to(value);
          });

          it('should return string | null', () => {
            expect(result).toBe(expectedValue);
          });
        });
      },
    );
  });
});
