import { beforeAll, describe, expect, it } from '@jest/globals';

import { CardFixtures } from '@cornie-js/backend-app-game-fixtures/cards/domain';
import { NonStartedGameFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Card, ColoredCard } from '@cornie-js/backend-game-domain/cards';
import {
  GameCardSpec,
  GameDirection,
  GameInitialDraws,
  NonStartedGame,
} from '@cornie-js/backend-game-domain/games';

import { GameService } from './GameService';

describe(GameService.name, () => {
  let gameService: GameService;

  beforeAll(() => {
    gameService = new GameService();
  });

  describe('.getInitialCardColor', () => {
    describe('having a colored card', () => {
      let coloredCardFixture: Card & ColoredCard;

      beforeAll(() => {
        coloredCardFixture = CardFixtures.reverseCard;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameService.getInitialCardColor(coloredCardFixture);
        });

        it('should return a CardColor', () => {
          expect(result).toBe(coloredCardFixture.color);
        });
      });
    });
  });

  describe('.getInitialCardsDraw', () => {
    describe('having a Game with enough cards', () => {
      let gameFixture: NonStartedGame;
      let deckCardSpec: GameCardSpec;

      beforeAll(() => {
        gameFixture =
          NonStartedGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120;

        [deckCardSpec] = gameFixture.spec.cards as [GameCardSpec];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameService.getInitialCardsDraw(gameFixture);
        });

        it('should return an array of cards and game card spec with the remaining deck cards', () => {
          const expectedCards: Card[][] = [
            new Array<Card>(7).fill(deckCardSpec.card),
            new Array<Card>(7).fill(deckCardSpec.card),
          ];

          const expectedDeckSpec: GameCardSpec[] = [
            {
              amount: deckCardSpec.amount - 15,
              card: deckCardSpec.card,
            },
          ];

          const expectedGameInitialDraws: GameInitialDraws = {
            currentCard: deckCardSpec.card,
            playersCards: expectedCards,
            remainingDeck: expectedDeckSpec,
          };

          expect(result).toStrictEqual(expectedGameInitialDraws);
        });
      });
    });

    describe('having a Game with not enough cards', () => {
      let gameFixture: NonStartedGame;

      beforeAll(() => {
        gameFixture =
          NonStartedGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameService.getInitialCardsDraw(gameFixture);
          } catch (error) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message: 'Not enough cards to perform this operation',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });

  describe('.getInitialDirection', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameService.getInitialDirection();
      });

      it('should return a GameDirection', () => {
        expect(result).toBe(GameDirection.antiClockwise);
      });
    });
  });

  describe('.getInitialDrawCount', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameService.getInitialDrawCount();
      });

      it('should return a number', () => {
        expect(result).toBe(0);
      });
    });
  });

  describe('.getInitialPlayingSlotIndex', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameService.getInitialPlayingSlotIndex();
      });

      it('should return a number', () => {
        expect(result).toBe(0);
      });
    });
  });
});
