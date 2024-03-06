import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GamePlayCardsUpdateQueryFromGameBuilder } from './GamePlayCardsUpdateQueryFromGameBuilder';

describe(GamePlayCardsUpdateQueryFromGameBuilder.name, () => {
  let areCardsEqualsSpecMock: jest.Mocked<AreCardsEqualsSpec>;
  let gameServiceMock: jest.Mocked<GameService>;

  let gamePlayCardsUpdateQueryFromGameBuilder: GamePlayCardsUpdateQueryFromGameBuilder;

  beforeAll(() => {
    areCardsEqualsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<AreCardsEqualsSpec>
    > as jest.Mocked<AreCardsEqualsSpec>;

    gameServiceMock = {
      getGameSlotOrThrow: jest.fn() as unknown,
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    gamePlayCardsUpdateQueryFromGameBuilder =
      new GamePlayCardsUpdateQueryFromGameBuilder(
        areCardsEqualsSpecMock,
        gameServiceMock,
      );
  });

  describe('.build', () => {
    describe('having an existing slotIndex and cardIndexes empty', () => {
      let gameFixture: ActiveGame;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardIndexesFixture = [];
        slotIndexFixture = 0;
      });

      describe('when called', () => {
        let gameSlotFixture: ActiveGameSlot;

        let result: unknown;

        beforeAll(() => {
          gameSlotFixture = ActiveGameSlotFixtures.any;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          try {
            gamePlayCardsUpdateQueryFromGameBuilder.build(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message:
              'An unexpected error happened while attempting to update game',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having existing cardIndexes', () => {
      let cardFixture: Card;
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.normalBlueTwoCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = {
          ...ActiveGameSlotFixtures.any,
          cards: [cardFixture, CardFixtures.any],
        };
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValue(false);

          result = gamePlayCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardIndexesFixture,
            slotIndexFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          areCardsEqualsSpecMock.isSatisfiedBy.mockReset();
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedCards: Card[] = gameSlotFixture.cards.filter(
            (_: Card, index: number): boolean =>
              !cardIndexesFixture.includes(index),
          );

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentCard: cardFixture,
            currentTurnCardsPlayed: true,
            discardPile: [
              ...gameFixture.state.discardPile,
              {
                amount: 1,
                card: cardFixture,
              },
            ],
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: expectedCards,
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: slotIndexFixture,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });
  });
});
