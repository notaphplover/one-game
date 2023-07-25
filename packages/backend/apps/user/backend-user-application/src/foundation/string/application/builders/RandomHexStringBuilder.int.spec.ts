import { beforeAll, describe, expect, it } from '@jest/globals';

import { RandomHexStringBuilder } from './RandomHexStringBuilder';

describe(RandomHexStringBuilder.name, () => {
  let randomHexStringBuilder: RandomHexStringBuilder;

  beforeAll(() => {
    randomHexStringBuilder = new RandomHexStringBuilder();
  });

  describe('.build', () => {
    let hexNumberRegex: RegExp;

    beforeAll(() => {
      hexNumberRegex = /[0-9a-f]*/;
    });

    describe.each<[number]>([[0], [1], [2], [3], [4], [5]])(
      'having a length of %s',
      (length: number) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = randomHexStringBuilder.build(length);
          });

          it('should return an hex string', () => {
            expect(result).toStrictEqual(expect.stringMatching(hexNumberRegex));
            expect(result).toHaveLength(length);
          });
        });
      },
    );
  });
});
