import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { GameSpecFixtures } from '../fixtures/GameSpecFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { IsGameFinishedSpec } from '../specs/IsGameFinishedSpec';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';
import { GamePassTurnUpdateQueryFromGameBuilder } from './GamePassTurnUpdateQueryFromGameBuilder';

describe(GamePassTurnUpdateQueryFromGameBuilder.name, () => {
  let isGameFinishedSpecMock: jest.Mocked<IsGameFinishedSpec>;

  let gamePassTurnUpdateQueryFromGameBuilder: GamePassTurnUpdateQueryFromGameBuilder;

  beforeAll(() => {
    isGameFinishedSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<IsGameFinishedSpec>
    > as jest.Mocked<IsGameFinishedSpec>;

    gamePassTurnUpdateQueryFromGameBuilder =
      new GamePassTurnUpdateQueryFromGameBuilder(isGameFinishedSpecMock);
  });

  describe('.build', () => {
    describe('having an active game with antiClockwise direction and skipCount 0', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixtures: GameSpec;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero,
          state: {
            ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero.state,
            currentDirection: GameDirection.antiClockwise,
            skipCount: 0,
          },
        };

        gameSpecFixtures = GameSpecFixtures.withGameSlotsAmountThree;
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 2,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns true', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 2,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            status: GameStatus.finished,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an active game with antiClockwise direction and skipCount 1', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixtures: GameSpec;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero,
          state: {
            ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero.state,
            currentDirection: GameDirection.antiClockwise,
            skipCount: 1,
          },
        };

        gameSpecFixtures = GameSpecFixtures.withGameSlotsAmountThree;
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 1,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns true', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 1,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            status: GameStatus.finished,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an active game with antiClockwise direction and skipCount 2', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixtures: GameSpec;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero,
          state: {
            ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero.state,
            currentDirection: GameDirection.antiClockwise,
            skipCount: 2,
          },
        };

        gameSpecFixtures = GameSpecFixtures.withGameSlotsAmountThree;
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 0,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns true', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 0,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            status: GameStatus.finished,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an active game with clockwise direction and skipCount 0', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixtures: GameSpec;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero,
          state: {
            ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero.state,
            currentDirection: GameDirection.clockwise,
            skipCount: 0,
          },
        };

        gameSpecFixtures = GameSpecFixtures.withGameSlotsAmountThree;
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 1,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns true', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 1,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            status: GameStatus.finished,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an active game with clockwise direction and skipCount 1', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixtures: GameSpec;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero,
          state: {
            ...ActiveGameFixtures.withSlotsThreeAndCurrentPlayingSlotZero.state,
            currentDirection: GameDirection.clockwise,
            skipCount: 1,
          },
        };

        gameSpecFixtures = GameSpecFixtures.withGameSlotsAmountThree;
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 2,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns true', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          result = gamePassTurnUpdateQueryFromGameBuilder.build(
            activeGameFixture,
            gameSpecFixtures,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpecMock.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expected: GameUpdateQuery = {
            currentPlayingSlotIndex: 2,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: null,
            gameFindQuery: {
              id: activeGameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  activeGameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 0,
            status: GameStatus.finished,
            turn: activeGameFixture.state.turn + 1,
            turnExpiresAt: expect.any(Date) as unknown as Date,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
