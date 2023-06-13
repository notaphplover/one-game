import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import {
  BlankCard,
  CardColor,
  DrawCard,
  NormalCard,
  ReverseCard,
  SkipCard,
  WildCard,
  WildDraw4Card,
} from '@cornie-js/backend-app-game-domain/cards/domain';
import { CardFixtures } from '@cornie-js/backend-app-game-fixtures/cards/domain';
import { Builder } from '@cornie-js/backend-common';

import { CardV1FromCardBuilder } from './CardV1FromCardBuilder';

describe(CardV1FromCardBuilder.name, () => {
  let cardColorV1FromCardColorBuilder: jest.Mocked<
    Builder<apiModels.CardColorV1, [CardColor]>
  >;

  let cardFromCardV1Builder: CardV1FromCardBuilder;

  beforeAll(() => {
    cardColorV1FromCardColorBuilder = {
      build: jest.fn(),
    };

    cardFromCardV1Builder = new CardV1FromCardBuilder(
      cardColorV1FromCardColorBuilder,
    );
  });

  describe('having a blank card', () => {
    let cardFixture: BlankCard;

    beforeAll(() => {
      cardFixture = CardFixtures.blankCard;
    });

    describe('.build', () => {
      describe('when called', () => {
        let expected: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          expected = {
            kind: 'blank',
          };

          result = cardFromCardV1Builder.build(cardFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('having a draw card', () => {
    let cardFixture: DrawCard;

    beforeAll(() => {
      cardFixture = CardFixtures.drawCard;
    });

    describe('.build', () => {
      describe('when called', () => {
        let expected: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          expected = {
            color: 'blue',
            kind: 'draw',
          };

          cardColorV1FromCardColorBuilder.build.mockReturnValueOnce(
            expected.color,
          );

          result = cardFromCardV1Builder.build(cardFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('having a normal card', () => {
    let cardFixture: NormalCard;

    beforeAll(() => {
      cardFixture = CardFixtures.normalCard;
    });

    describe('.build', () => {
      describe('when called', () => {
        let expected: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          expected = {
            color: 'blue',
            kind: 'normal',
            number: cardFixture.number,
          };

          cardColorV1FromCardColorBuilder.build.mockReturnValueOnce(
            expected.color,
          );

          result = cardFromCardV1Builder.build(cardFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('having a reverse card', () => {
    let cardFixture: ReverseCard;

    beforeAll(() => {
      cardFixture = CardFixtures.reverseCard;
    });

    describe('.build', () => {
      describe('when called', () => {
        let expected: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          expected = {
            color: 'blue',
            kind: 'reverse',
          };

          cardColorV1FromCardColorBuilder.build.mockReturnValueOnce(
            expected.color,
          );

          result = cardFromCardV1Builder.build(cardFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('having a skip card', () => {
    let cardFixture: SkipCard;

    beforeAll(() => {
      cardFixture = CardFixtures.skipCard;
    });

    describe('.build', () => {
      describe('when called', () => {
        let expected: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          expected = {
            color: 'blue',
            kind: 'skip',
          };

          cardColorV1FromCardColorBuilder.build.mockReturnValueOnce(
            expected.color,
          );

          result = cardFromCardV1Builder.build(cardFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('having a wild card', () => {
    let cardFixture: WildCard;

    beforeAll(() => {
      cardFixture = CardFixtures.wildCard;
    });

    describe('.build', () => {
      describe('when called', () => {
        let expected: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          expected = {
            kind: 'wild',
          };

          result = cardFromCardV1Builder.build(cardFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('having a wild draw card', () => {
    let cardFixture: WildDraw4Card;

    beforeAll(() => {
      cardFixture = CardFixtures.wildDraw4Card;
    });

    describe('.build', () => {
      describe('when called', () => {
        let expected: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          expected = {
            kind: 'wildDraw4',
          };

          result = cardFromCardV1Builder.build(cardFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
