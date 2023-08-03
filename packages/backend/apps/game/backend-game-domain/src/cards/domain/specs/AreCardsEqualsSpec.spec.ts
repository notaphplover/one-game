import { beforeAll, describe, expect, it } from '@jest/globals';

import { CardFixtures } from '../fixtures/CardFixtures';
import { Card } from '../valueObjects/Card';
import { AreCardsEqualsSpec } from './AreCardsEqualsSpec';

describe(AreCardsEqualsSpec.name, () => {
  let areCardsEqualsSpec: AreCardsEqualsSpec;

  beforeAll(() => {
    areCardsEqualsSpec = new AreCardsEqualsSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe.each<[string, Card[], boolean]>([
      ['no cards', [], true],
      ['any single card', [CardFixtures.any], true],
      [
        'a pair of wild cards',
        [CardFixtures.wildCard, CardFixtures.wildCard],
        true,
      ],
      [
        'a non wild card and a wild card',
        [CardFixtures.drawCard, CardFixtures.wildCard],
        false,
      ],
      [
        'a pair of wild draw 4 cards',
        [CardFixtures.wildDraw4Card, CardFixtures.wildDraw4Card],
        true,
      ],
      [
        'a non wild draw 4 card and a wild draw 4 card',
        [CardFixtures.drawCard, CardFixtures.wildDraw4Card],
        false,
      ],
      [
        'a pair of draw cards of the same color',
        [CardFixtures.drawBlueCard, CardFixtures.drawBlueCard],
        true,
      ],
      [
        'a pair of draw cards of different color',
        [CardFixtures.drawBlueCard, CardFixtures.drawRedCard],
        false,
      ],
      [
        'a pair of reverse cards of the same color',
        [CardFixtures.reverseBlueCard, CardFixtures.reverseBlueCard],
        true,
      ],
      [
        'a pair of reverse cards of different color',
        [CardFixtures.reverseBlueCard, CardFixtures.reverseRedCard],
        false,
      ],
      [
        'a pair of skip cards of the same color',
        [CardFixtures.skipBlueCard, CardFixtures.skipBlueCard],
        true,
      ],
      [
        'a pair of skip cards of different color',
        [CardFixtures.skipBlueCard, CardFixtures.skipRedCard],
        false,
      ],
      [
        'a pair of normal cards of the same color and number',
        [CardFixtures.normalBlueTwoCard, CardFixtures.normalBlueTwoCard],
        true,
      ],
      [
        'a pair of normal cards of the same color and different number',
        [CardFixtures.normalBlueTwoCard, CardFixtures.normalBlueSevenCard],
        false,
      ],
    ])('having %s', (_: string, cards: Card[], expectedResult: boolean) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = areCardsEqualsSpec.isSatisfiedBy(...cards);
        });

        it(`should return ${expectedResult.toString()}`, () => {
          expect(result).toBe(expectedResult);
        });
      });
    });
  });
});
