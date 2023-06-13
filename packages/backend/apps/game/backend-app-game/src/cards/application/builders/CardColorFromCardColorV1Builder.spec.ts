import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { CardColor } from '@cornie-js/backend-app-game-domain/cards/domain';

import { CardColorFromCardColorV1Builder } from './CardColorFromCardColorV1Builder';

const CARD_COLOR_V1_TO_TEST_ENTRY: {
  [TColor in apiModels.CardColorV1]: [TColor, CardColor];
} = {
  blue: ['blue', CardColor.blue],
  green: ['green', CardColor.green],
  red: ['red', CardColor.red],
  yellow: ['yellow', CardColor.yellow],
};

describe(CardColorFromCardColorV1Builder.name, () => {
  let cardColorFromCardColorV1Builder: CardColorFromCardColorV1Builder;

  beforeAll(() => {
    cardColorFromCardColorV1Builder = new CardColorFromCardColorV1Builder();
  });

  describe('.build', () => {
    describe.each<[apiModels.CardColorV1, CardColor]>(
      Object.values(CARD_COLOR_V1_TO_TEST_ENTRY),
    )(
      'having a card color v1 (%s)',
      (
        cardColorV1Fixture: apiModels.CardColorV1,
        cardColorFixture: CardColor,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = cardColorFromCardColorV1Builder.build(cardColorV1Fixture);
          });

          it('should return a CardColor', () => {
            expect(result).toBe(cardColorFixture);
          });
        });
      },
    );
  });
});
