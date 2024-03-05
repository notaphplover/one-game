import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { GameDrawMutationFixtures } from '../fixtures/GameDrawMutationFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDrawService } from '../services/GameDrawService';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameDrawCardsUpdateQueryFromGameBuilder } from './GameDrawCardsUpdateQueryFromGameBuilder';

describe(GameDrawCardsUpdateQueryFromGameBuilder.name, () => {
  let gameDrawServiceMock: jest.Mocked<GameDrawService>;
  let gameServiceMock: jest.Mocked<GameService>;

  let gameDrawCardsUpdateQueryFromGameBuilder: GameDrawCardsUpdateQueryFromGameBuilder;

  beforeAll(() => {
    gameDrawServiceMock = {
      calculateDrawMutation: jest.fn(),
    } as Partial<jest.Mocked<GameDrawService>> as jest.Mocked<GameDrawService>;

    gameServiceMock = {
      getGameSlotOrThrow: jest.fn() as unknown,
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    gameDrawCardsUpdateQueryFromGameBuilder =
      new GameDrawCardsUpdateQueryFromGameBuilder(
        gameDrawServiceMock,
        gameServiceMock,
      );
  });

  describe('.build', () => {
    describe('having a having a Game with two players currentTurnCardsPlayed false and drawCount 0', () => {
      let gameFixture: ActiveGame;

      beforeAll(() => {
        gameFixture = {
          ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse,
          state: {
            ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse.state,
            drawCount: 0,
          },
        };
      });

      describe('when called, and gameDrawService.calculateDrawMutation() returns a DrawMutation with isDiscardPileEmptied false', () => {
        let activeGameSlotFixture: ActiveGameSlot;
        let gameDrawMutationFixture: GameDrawMutation;

        let result: unknown;

        beforeAll(() => {
          activeGameSlotFixture = ActiveGameSlotFixtures.withCardsTwo;
          gameDrawMutationFixture =
            GameDrawMutationFixtures.withIsDiscardPileEmptiedFalse;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            activeGameSlotFixture,
          );

          gameDrawServiceMock.calculateDrawMutation.mockReturnValueOnce(
            gameDrawMutationFixture,
          );

          result = gameDrawCardsUpdateQueryFromGameBuilder.build(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameDrawService.calculateDrawMutation()', () => {
          expect(
            gameDrawServiceMock.calculateDrawMutation,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDrawServiceMock.calculateDrawMutation,
          ).toHaveBeenCalledWith(
            gameFixture.state.deck,
            gameFixture.state.discardPile,
            1,
          );
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            gameFixture.state.currentPlayingSlotIndex,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentTurnCardsDrawn: true,
            currentTurnSingleCardDraw: gameDrawMutationFixture.cards[0] as Card,
            deck: gameDrawMutationFixture.deck,
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: [
                  ...activeGameSlotFixture.cards,
                  ...gameDrawMutationFixture.cards,
                ],
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: gameFixture.state.currentPlayingSlotIndex,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and gameDrawService.calculateDrawMutation() returns a DrawMutation with isDiscardPileEmptied true', () => {
        let activeGameSlotFixture: ActiveGameSlot;
        let gameDrawMutationFixture: GameDrawMutation;

        let result: unknown;

        beforeAll(() => {
          activeGameSlotFixture = ActiveGameSlotFixtures.withCardsTwo;
          gameDrawMutationFixture =
            GameDrawMutationFixtures.withIsDiscardPileEmptiedTrue;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            activeGameSlotFixture,
          );

          gameDrawServiceMock.calculateDrawMutation.mockReturnValueOnce(
            gameDrawMutationFixture,
          );

          result = gameDrawCardsUpdateQueryFromGameBuilder.build(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameDrawService.calculateDrawMutation()', () => {
          expect(
            gameDrawServiceMock.calculateDrawMutation,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDrawServiceMock.calculateDrawMutation,
          ).toHaveBeenCalledWith(
            gameFixture.state.deck,
            gameFixture.state.discardPile,
            1,
          );
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            gameFixture.state.currentPlayingSlotIndex,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentTurnCardsDrawn: true,
            currentTurnSingleCardDraw: gameDrawMutationFixture.cards[0] as Card,
            deck: gameDrawMutationFixture.deck,
            discardPile: [],
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: [
                  ...activeGameSlotFixture.cards,
                  ...gameDrawMutationFixture.cards,
                ],
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: gameFixture.state.currentPlayingSlotIndex,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a having a Game with two players currentTurnCardsPlayed false and drawCount 2', () => {
      let gameFixture: ActiveGame;

      beforeAll(() => {
        gameFixture = {
          ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse,
          state: {
            ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse.state,
            drawCount: 2,
          },
        };
      });

      describe('when called, and gameDrawService.calculateDrawMutation() returns a DrawMutation with isDiscardPileEmptied false', () => {
        let activeGameSlotFixture: ActiveGameSlot;
        let gameDrawMutationFixture: GameDrawMutation;

        let result: unknown;

        beforeAll(() => {
          activeGameSlotFixture = ActiveGameSlotFixtures.withCardsTwo;
          gameDrawMutationFixture =
            GameDrawMutationFixtures.withIsDiscardPileEmptiedFalse;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            activeGameSlotFixture,
          );

          gameDrawServiceMock.calculateDrawMutation.mockReturnValueOnce(
            gameDrawMutationFixture,
          );

          result = gameDrawCardsUpdateQueryFromGameBuilder.build(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameDrawService.calculateDrawMutation()', () => {
          expect(
            gameDrawServiceMock.calculateDrawMutation,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDrawServiceMock.calculateDrawMutation,
          ).toHaveBeenCalledWith(
            gameFixture.state.deck,
            gameFixture.state.discardPile,
            gameFixture.state.drawCount,
          );
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            gameFixture.state.currentPlayingSlotIndex,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentTurnCardsDrawn: true,
            deck: gameDrawMutationFixture.deck,
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: [
                  ...activeGameSlotFixture.cards,
                  ...gameDrawMutationFixture.cards,
                ],
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: gameFixture.state.currentPlayingSlotIndex,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and gameDrawService.calculateDrawMutation() returns a DrawMutation with isDiscardPileEmptied true', () => {
        let activeGameSlotFixture: ActiveGameSlot;
        let gameDrawMutationFixture: GameDrawMutation;

        let result: unknown;

        beforeAll(() => {
          activeGameSlotFixture = ActiveGameSlotFixtures.withCardsTwo;
          gameDrawMutationFixture =
            GameDrawMutationFixtures.withIsDiscardPileEmptiedTrue;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            activeGameSlotFixture,
          );

          gameDrawServiceMock.calculateDrawMutation.mockReturnValueOnce(
            gameDrawMutationFixture,
          );

          result = gameDrawCardsUpdateQueryFromGameBuilder.build(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameDrawService.calculateDrawMutation()', () => {
          expect(
            gameDrawServiceMock.calculateDrawMutation,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDrawServiceMock.calculateDrawMutation,
          ).toHaveBeenCalledWith(
            gameFixture.state.deck,
            gameFixture.state.discardPile,
            gameFixture.state.drawCount,
          );
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            gameFixture.state.currentPlayingSlotIndex,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentTurnCardsDrawn: true,
            deck: gameDrawMutationFixture.deck,
            discardPile: [],
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: [
                  ...activeGameSlotFixture.cards,
                  ...gameDrawMutationFixture.cards,
                ],
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: gameFixture.state.currentPlayingSlotIndex,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
