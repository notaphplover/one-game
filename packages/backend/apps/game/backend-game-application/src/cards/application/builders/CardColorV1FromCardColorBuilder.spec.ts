import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { CardColor } from '@cornie-js/backend-game-domain/cards';

import { CardColorV1FromCardColorBuilder } from './CardColorV1FromCardColorBuilder';

const CARD_COLOR_V1_TO_TEST_ENTRY: {
  [TColor in CardColor]: [TColor, apiModels.CardColorV1];
} = {
  [CardColor.blue]: [CardColor.blue, 'blue'],
  [CardColor.green]: [CardColor.green, 'green'],
  [CardColor.red]: [CardColor.red, 'red'],
  [CardColor.yellow]: [CardColor.yellow, 'yellow'],
};

describe(CardColorV1FromCardColorBuilder.name, () => {
  let cardColorFromCardColorV1Builder: CardColorV1FromCardColorBuilder;

  beforeAll(() => {
    cardColorFromCardColorV1Builder = new CardColorV1FromCardColorBuilder();
  });

  describe('.build', () => {
    describe.each<[CardColor, apiModels.CardColorV1]>(
      Object.values(CARD_COLOR_V1_TO_TEST_ENTRY),
    )(
      'having a card color v1 (%s)',
      (
        cardColorFixture: CardColor,
        cardColorV1Fixture: apiModels.CardColorV1,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = cardColorFromCardColorV1Builder.build(cardColorFixture);
          });

          it('should return a CardColor', () => {
            expect(result).toBe(cardColorV1Fixture);
          });
        });
      },
    );
  });
});
