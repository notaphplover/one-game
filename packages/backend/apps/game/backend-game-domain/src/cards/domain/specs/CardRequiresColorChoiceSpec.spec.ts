import { beforeAll, describe, expect, it } from '@jest/globals';

import { CardFixtures } from '../fixtures/CardFixtures';
import { Card } from '../valueObjects/Card';
import { CardRequiresColorChoiceSpec } from './CardRequiresColorChoiceSpec';

describe(CardRequiresColorChoiceSpec.name, () => {
  let cardRequiresColorChoiceSpec: CardRequiresColorChoiceSpec;

  beforeAll(() => {
    cardRequiresColorChoiceSpec = new CardRequiresColorChoiceSpec();
  });

  describe('.isSatisfiedBy()', () => {
    describe('having a colored card', () => {
      let cardFixture: Card;

      beforeAll(() => {
        cardFixture = CardFixtures.normalCard;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = cardRequiresColorChoiceSpec.isSatisfiedBy(cardFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having a non colored card', () => {
      let cardFixture: Card;

      beforeAll(() => {
        cardFixture = CardFixtures.wildCard;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = cardRequiresColorChoiceSpec.isSatisfiedBy(cardFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });
  });
});
