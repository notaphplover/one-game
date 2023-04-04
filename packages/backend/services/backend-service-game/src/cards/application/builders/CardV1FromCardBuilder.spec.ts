import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { CardFixtures } from '../../domain/fixtures/CardFixtures';
import { BlankCard } from '../../domain/models/BlankCard';
import { CardColor } from '../../domain/models/CardColor';
import { DrawCard } from '../../domain/models/DrawCard';
import { NormalCard } from '../../domain/models/NormalCard';
import { ReverseCard } from '../../domain/models/ReverseCard';
import { SkipCard } from '../../domain/models/SkipCard';
import { WildCard } from '../../domain/models/WildCard';
import { WildDraw4Card } from '../../domain/models/WildDraw4Card';
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
