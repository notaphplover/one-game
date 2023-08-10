import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameCardSpecFixtures } from '../fixtures/GameCardSpecFixtures';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameDrawService } from './GameDrawService';

describe(GameDrawService.name, () => {
  let gameDrawService: GameDrawService;

  beforeAll(() => {
    gameDrawService = new GameDrawService();
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
});
