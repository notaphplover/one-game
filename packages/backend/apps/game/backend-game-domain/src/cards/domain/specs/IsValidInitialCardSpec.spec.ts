import { beforeAll, describe, expect, it } from '@jest/globals';

import { CardFixtures } from '../fixtures';
import { Card } from '../valueObjects/Card';
import { IsValidInitialCardSpec } from './IsValidInitialCardSpec';

describe(IsValidInitialCardSpec.name, () => {
  let isValidInitialCardSpec: IsValidInitialCardSpec;

  beforeAll(() => {
    isValidInitialCardSpec = new IsValidInitialCardSpec();
  });

  describe.each<[string, Card, boolean]>([
    ['a wild draw 4 card', CardFixtures.wildDraw4Card, false],
    ['a non wild draw 4 card', CardFixtures.normalBlueSevenCard, true],
  ])('having %s', (_: string, cardFixture: Card, expectedResult: boolean) => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isValidInitialCardSpec.isSatisfiedBy(cardFixture);
      });

      it('should return boolean', () => {
        expect(result).toBe(expectedResult);
      });
    });
  });
});
