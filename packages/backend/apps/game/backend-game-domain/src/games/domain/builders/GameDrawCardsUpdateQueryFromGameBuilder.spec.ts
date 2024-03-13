import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { GameDrawMutationFixtures } from '../fixtures/GameDrawMutationFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameDrawCardsUpdateQueryFromGameBuilder } from './GameDrawCardsUpdateQueryFromGameBuilder';

describe(GameDrawCardsUpdateQueryFromGameBuilder.name, () => {
  let gameServiceMock: jest.Mocked<GameService>;

  let gameDrawCardsUpdateQueryFromGameBuilder: GameDrawCardsUpdateQueryFromGameBuilder;

  beforeAll(() => {
    gameServiceMock = {
      getGameSlotOrThrow: jest.fn() as unknown,
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    gameDrawCardsUpdateQueryFromGameBuilder =
      new GameDrawCardsUpdateQueryFromGameBuilder(gameServiceMock);
  });

  describe('.build', () => {
    describe('having a Game with two players and a GameDrawMutation with a single card and isDiscardPileEmptied false', () => {
      let gameFixture: ActiveGame;
      let gameDrawMutationFixture: GameDrawMutation;

      beforeAll(() => {
        gameFixture = {
          ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse,
          state: {
            ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse.state,
          },
        };
        gameDrawMutationFixture = {
          ...GameDrawMutationFixtures.withCardsOne,
          isDiscardPileEmptied: false,
        };
      });

      describe('when called', () => {
        let activeGameSlotFixture: ActiveGameSlot;

        let result: unknown;

        beforeAll(() => {
          activeGameSlotFixture = ActiveGameSlotFixtures.withCardsTwo;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            activeGameSlotFixture,
          );

          result = gameDrawCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            gameDrawMutationFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
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
    });

    describe('having a Game with two players and a GameDrawMutation with a single card and isDiscardPileEmptied true', () => {
      let gameFixture: ActiveGame;
      let gameDrawMutationFixture: GameDrawMutation;

      beforeAll(() => {
        gameFixture = {
          ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse,
          state: {
            ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse.state,
          },
        };
        gameDrawMutationFixture = {
          ...GameDrawMutationFixtures.withCardsOne,
          isDiscardPileEmptied: true,
        };
      });

      describe('when called', () => {
        let activeGameSlotFixture: ActiveGameSlot;

        let result: unknown;

        beforeAll(() => {
          activeGameSlotFixture = ActiveGameSlotFixtures.withCardsTwo;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            activeGameSlotFixture,
          );

          result = gameDrawCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            gameDrawMutationFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
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

    describe('having a Game with two players and a GameDrawMutation with two cards and isDiscardPileEmptied false', () => {
      let gameFixture: ActiveGame;
      let gameDrawMutationFixture: GameDrawMutation;

      beforeAll(() => {
        gameFixture = {
          ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse,
          state: {
            ...ActiveGameFixtures.withCurrentTurnCardsPlayedFalse.state,
          },
        };
        gameDrawMutationFixture = {
          ...GameDrawMutationFixtures.withCardsTwo,
          isDiscardPileEmptied: false,
        };
      });

      describe('when called', () => {
        let activeGameSlotFixture: ActiveGameSlot;

        let result: unknown;

        beforeAll(() => {
          activeGameSlotFixture = ActiveGameSlotFixtures.withCardsTwo;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            activeGameSlotFixture,
          );

          result = gameDrawCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            gameDrawMutationFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
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
    });
  });
});
