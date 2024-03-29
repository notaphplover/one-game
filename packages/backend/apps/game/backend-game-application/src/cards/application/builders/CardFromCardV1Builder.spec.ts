import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  Card,
  CardColor,
  CardKind,
} from '@cornie-js/backend-game-domain/cards';

import { CardV1Fixtures } from '../fixtures/CardV1Fixtures';
import { CardFromCardV1Builder } from './CardFromCardV1Builder';

describe(CardFromCardV1Builder.name, () => {
  let cardColorFromCardColorV1Builder: jest.Mocked<
    Builder<CardColor, [apiModels.CardColorV1]>
  >;

  let cardFromCardV1Builder: CardFromCardV1Builder;

  beforeAll(() => {
    cardColorFromCardColorV1Builder = {
      build: jest.fn(),
    };

    cardFromCardV1Builder = new CardFromCardV1Builder(
      cardColorFromCardColorV1Builder,
    );
  });

  describe('.build', () => {
    describe('having a draw card v1', () => {
      let cardV1Fixture: apiModels.DrawCardV1;

      beforeAll(() => {
        cardV1Fixture = CardV1Fixtures.drawCard;
      });

      describe('when called', () => {
        let expected: Card;

        let result: unknown;

        beforeAll(() => {
          expected = {
            color: CardColor.blue,
            kind: CardKind.draw,
          };

          cardColorFromCardColorV1Builder.build.mockReturnValueOnce(
            expected.color,
          );

          result = cardFromCardV1Builder.build(cardV1Fixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a normal card v1', () => {
      let cardV1Fixture: apiModels.NormalCardV1;

      beforeAll(() => {
        cardV1Fixture = CardV1Fixtures.normalCard;
      });

      describe('when called', () => {
        let expected: Card;

        let result: unknown;

        beforeAll(() => {
          expected = {
            color: CardColor.blue,
            kind: CardKind.normal,
            number: cardV1Fixture.number,
          };

          cardColorFromCardColorV1Builder.build.mockReturnValueOnce(
            expected.color,
          );

          result = cardFromCardV1Builder.build(cardV1Fixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a reverse card v1', () => {
      let cardV1Fixture: apiModels.ReverseCardV1;

      beforeAll(() => {
        cardV1Fixture = CardV1Fixtures.reverseCard;
      });

      describe('when called', () => {
        let expected: Card;

        let result: unknown;

        beforeAll(() => {
          expected = {
            color: CardColor.blue,
            kind: CardKind.reverse,
          };

          cardColorFromCardColorV1Builder.build.mockReturnValueOnce(
            expected.color,
          );

          result = cardFromCardV1Builder.build(cardV1Fixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a skip card v1', () => {
      let cardV1Fixture: apiModels.SkipCardV1;

      beforeAll(() => {
        cardV1Fixture = CardV1Fixtures.skipCard;
      });

      describe('when called', () => {
        let expected: Card;

        let result: unknown;

        beforeAll(() => {
          expected = {
            color: CardColor.blue,
            kind: CardKind.skip,
          };

          cardColorFromCardColorV1Builder.build.mockReturnValueOnce(
            expected.color,
          );

          result = cardFromCardV1Builder.build(cardV1Fixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a wild card v1', () => {
      let cardV1Fixture: apiModels.WildCardV1;

      beforeAll(() => {
        cardV1Fixture = CardV1Fixtures.wildCard;
      });

      describe('when called', () => {
        let expected: Card;

        let result: unknown;

        beforeAll(() => {
          expected = {
            kind: CardKind.wild,
          };

          result = cardFromCardV1Builder.build(cardV1Fixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a Card', () => {
          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a wild draw card v1', () => {
      let cardV1Fixture: apiModels.WildDraw4CardV1;

      beforeAll(() => {
        cardV1Fixture = CardV1Fixtures.wildDraw4Card;
      });

      describe('when called', () => {
        let expected: Card;

        let result: unknown;

        beforeAll(() => {
          expected = {
            kind: CardKind.wildDraw4,
          };

          result = cardFromCardV1Builder.build(cardV1Fixture);
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
