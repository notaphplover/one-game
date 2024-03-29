import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { GameCardSpecFixtures } from '../fixtures/GameCardSpecFixtures';
import { GameSpecFixtures } from '../fixtures/GameSpecFixtures';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameDrawService } from './GameDrawService';

describe(GameDrawService.name, () => {
  let areCardsEqualsSpecMock: jest.Mocked<AreCardsEqualsSpec>;

  let gameDrawService: GameDrawService;

  beforeAll(() => {
    areCardsEqualsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<AreCardsEqualsSpec>
    > as jest.Mocked<AreCardsEqualsSpec>;

    gameDrawService = new GameDrawService(areCardsEqualsSpecMock);
  });

  describe('.calculateDrawMutation', () => {
    describe('having a deck with a single spec and an amount lower than the deck size', () => {
      let deckCardSpecFixture: GameCardSpec;
      let amountFixture: number;

      beforeAll(() => {
        deckCardSpecFixture = GameCardSpecFixtures.withAmount4;
        amountFixture = deckCardSpecFixture.amount - 1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameDrawService.calculateDrawMutation(
            [deckCardSpecFixture],
            [],
            amountFixture,
          );
        });

        it('should return a GameDrawMutation', () => {
          const expected: GameDrawMutation = {
            cards: new Array(amountFixture)
              .fill(undefined)
              .map(() => deckCardSpecFixture.card),
            deck: [
              {
                ...deckCardSpecFixture,
                amount: deckCardSpecFixture.amount - amountFixture,
              },
            ],
            isDiscardPileEmptied: false,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a deck with a single spec and an amount lower than half the deck size', () => {
      let deckCardSpecFixture: GameCardSpec;
      let amountFixture: number;

      beforeAll(() => {
        deckCardSpecFixture = GameCardSpecFixtures.withAmount4;
        amountFixture = 1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameDrawService.calculateDrawMutation(
            [deckCardSpecFixture],
            [],
            amountFixture,
          );
        });

        it('should return a GameDrawMutation', () => {
          const expected: GameDrawMutation = {
            cards: new Array(amountFixture)
              .fill(undefined)
              .map(() => deckCardSpecFixture.card),
            deck: [
              {
                ...deckCardSpecFixture,
                amount: deckCardSpecFixture.amount - amountFixture,
              },
            ],
            isDiscardPileEmptied: false,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a deck with a single spec and an amount equal to the deck size', () => {
      let deckCardSpecFixture: GameCardSpec;
      let amountFixture: number;

      beforeAll(() => {
        deckCardSpecFixture = GameCardSpecFixtures.withAmount4;
        amountFixture = deckCardSpecFixture.amount;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameDrawService.calculateDrawMutation(
            [deckCardSpecFixture],
            [],
            amountFixture,
          );
        });

        it('should return a GameDrawMutation', () => {
          const expected: GameDrawMutation = {
            cards: new Array(amountFixture)
              .fill(undefined)
              .map(() => deckCardSpecFixture.card),
            deck: [
              {
                ...deckCardSpecFixture,
                amount: deckCardSpecFixture.amount - amountFixture,
              },
            ],
            isDiscardPileEmptied: false,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a deck with a two specs and an amount equal to the deck size', () => {
      let deckCardSpecFixture: GameCardSpec;
      let amountFixture: number;

      beforeAll(() => {
        deckCardSpecFixture = GameCardSpecFixtures.withAmount4;
        amountFixture = deckCardSpecFixture.amount + deckCardSpecFixture.amount;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameDrawService.calculateDrawMutation(
            [deckCardSpecFixture, deckCardSpecFixture],
            [],
            amountFixture,
          );
        });

        it('should return a GameDrawMutation', () => {
          const expected: GameDrawMutation = {
            cards: new Array(amountFixture)
              .fill(undefined)
              .map(() => deckCardSpecFixture.card),
            deck: [
              {
                ...deckCardSpecFixture,
                amount: 0,
              },
              {
                ...deckCardSpecFixture,
                amount: 0,
              },
            ],
            isDiscardPileEmptied: false,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a deck with a single spec and a discard pile with a single spec an amount equal to almost the deck size plus the discard pile size', () => {
      let deckCardSpecFixture: GameCardSpec;
      let amountFixture: number;

      beforeAll(() => {
        deckCardSpecFixture = GameCardSpecFixtures.withAmount4;
        amountFixture =
          deckCardSpecFixture.amount + deckCardSpecFixture.amount - 1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameDrawService.calculateDrawMutation(
            [deckCardSpecFixture],
            [deckCardSpecFixture],
            amountFixture,
          );
        });

        it('should return a GameDrawMutation', () => {
          const expected: GameDrawMutation = {
            cards: new Array(amountFixture)
              .fill(undefined)
              .map(() => deckCardSpecFixture.card),
            deck: [
              {
                ...deckCardSpecFixture,
                amount: 1,
              },
            ],
            isDiscardPileEmptied: true,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a deck with a single spec and a discard pile with a single spec an amount equal to the deck size plus the discard pile size', () => {
      let deckCardSpecFixture: GameCardSpec;
      let amountFixture: number;

      beforeAll(() => {
        deckCardSpecFixture = GameCardSpecFixtures.withAmount4;
        amountFixture = deckCardSpecFixture.amount + deckCardSpecFixture.amount;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameDrawService.calculateDrawMutation(
            [deckCardSpecFixture],
            [deckCardSpecFixture],
            amountFixture,
          );
        });

        it('should return a GameDrawMutation', () => {
          const expected: GameDrawMutation = {
            cards: new Array(amountFixture)
              .fill(undefined)
              .map(() => deckCardSpecFixture.card),
            deck: [
              {
                ...deckCardSpecFixture,
                amount: 0,
              },
            ],
            isDiscardPileEmptied: true,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a deck with a single spec and a discard pile with a single spec an amount greater than the deck size plus the discard pile size', () => {
      let deckCardSpecFixture: GameCardSpec;
      let amountFixture: number;

      beforeAll(() => {
        deckCardSpecFixture = GameCardSpecFixtures.withAmount4;
        amountFixture =
          deckCardSpecFixture.amount + deckCardSpecFixture.amount + 1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameDrawService.calculateDrawMutation(
            [deckCardSpecFixture],
            [deckCardSpecFixture],
            amountFixture,
          );
        });

        it('should return a GameDrawMutation', () => {
          const expected: GameDrawMutation = {
            cards: new Array(
              deckCardSpecFixture.amount + deckCardSpecFixture.amount,
            )
              .fill(undefined)
              .map(() => deckCardSpecFixture.card),
            deck: [
              {
                ...deckCardSpecFixture,
                amount: 0,
              },
            ],
            isDiscardPileEmptied: true,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('.calculateInitialCardsDrawMutation', () => {
    describe('having a GameSpec with hundred of cards and a gameSlotAmount of two', () => {
      let gameCardSpecFixture: GameCardSpec;
      let gameSpecFixture: GameSpec;

      beforeAll(() => {
        gameCardSpecFixture = GameCardSpecFixtures.withAmount120;
        gameSpecFixture = {
          ...GameSpecFixtures.withGameSlotsAmountTwo,
          cards: [gameCardSpecFixture],
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            gameDrawService.calculateInitialCardsDrawMutation(gameSpecFixture);
        });

        it('should return a GameInitialDrawsMutation', () => {
          const expected: GameInitialDrawsMutation = {
            cards: new Array<Card[]>(2).fill(
              new Array<Card>(7).fill(gameCardSpecFixture.card),
            ),
            currentCard: gameCardSpecFixture.card,
            deck: [
              {
                amount: gameCardSpecFixture.amount - 15,
                card: gameCardSpecFixture.card,
              },
            ],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameSpec with no cards and a gameSlotAmount of two', () => {
      let gameCardSpecFixture: GameCardSpec;
      let gameSpecFixture: GameSpec;

      beforeAll(() => {
        gameCardSpecFixture = GameCardSpecFixtures.withAmount0;
        gameSpecFixture = {
          ...GameSpecFixtures.withGameSlotsAmountTwo,
          cards: [gameCardSpecFixture],
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameDrawService.calculateInitialCardsDrawMutation(gameSpecFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message:
              'Unable to calculate draw. Reason: the spec has not enough cards!',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });

  describe('.putCards', () => {
    describe('having a deck with a single card spec and a card array of a single element', () => {
      let cardFixture: Card;
      let cardSpecFixture: GameCardSpec;

      beforeAll(() => {
        cardFixture = CardFixtures.any;
        cardSpecFixture = GameCardSpecFixtures.any;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() return false', () => {
        let deckFixture: [GameCardSpec];

        let result: unknown;

        beforeAll(() => {
          deckFixture = [{ ...cardSpecFixture }];

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gameDrawService.putCards(deckFixture, [cardFixture]);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call areCardsEqualsSpec.isSatisfiedBy()', () => {
          expect(areCardsEqualsSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(areCardsEqualsSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            cardFixture,
            cardSpecFixture.card,
          );
        });

        it('should update deck', () => {
          const expected: GameCardSpec[] = [
            cardSpecFixture,
            {
              amount: 1,
              card: cardFixture,
            },
          ];

          expect(deckFixture).toStrictEqual(expected);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() return true', () => {
        let deckFixture: [GameCardSpec];

        let result: unknown;

        beforeAll(() => {
          deckFixture = [{ ...cardSpecFixture }];

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          result = gameDrawService.putCards(deckFixture, [cardFixture]);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call areCardsEqualsSpec.isSatisfiedBy()', () => {
          expect(areCardsEqualsSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(areCardsEqualsSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            cardFixture,
            cardSpecFixture.card,
          );
        });

        it('should update deck', () => {
          const expected: GameCardSpec[] = [
            {
              amount: cardSpecFixture.amount + 1,
              card: cardSpecFixture.card,
            },
          ];

          expect(deckFixture).toStrictEqual(expected);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
