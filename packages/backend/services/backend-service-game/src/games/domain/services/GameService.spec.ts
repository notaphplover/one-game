import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { Card } from '../../../cards/domain/models/Card';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { Game } from '../models/Game';
import { GameCardSpec } from '../models/GameCardSpec';
import { GameInitialDraws } from '../models/GameInitialDraws';
import { GameService } from './GameService';

describe(GameService.name, () => {
  let gameService: GameService;

  beforeAll(() => {
    gameService = new GameService();
  });

  describe('.getInitialCardsDraw', () => {
    describe('having a Game with enough cards', () => {
      let gameFixture: Game;
      let deckCardSpec: GameCardSpec;

      beforeAll(() => {
        gameFixture =
          NonStartedGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120;

        [deckCardSpec] = gameFixture.deck as [GameCardSpec];
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
      let gameFixture: Game;
      let deckCardSpec: GameCardSpec;

      beforeAll(() => {
        gameFixture =
          NonStartedGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount0;

        [deckCardSpec] = gameFixture.deck as [GameCardSpec];
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
});
