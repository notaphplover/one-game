import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { GameOptionsFixtures } from '../fixtures/GameOptionsFixtures';
import { GameOptions } from '../valueObjects/GameOptions';
import { CardCanBePlayedSpec } from './CardCanBePlayedSpec';
import { PlayerCanPassTurnSpec } from './PlayerCanPassTurnSpec';

describe(PlayerCanPassTurnSpec.name, () => {
  let cardCanBePlayedSpecMock: jest.Mocked<CardCanBePlayedSpec>;

  let playerCanPassTurnSpec: PlayerCanPassTurnSpec;

  beforeAll(() => {
    cardCanBePlayedSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<CardCanBePlayedSpec>
    > as jest.Mocked<CardCanBePlayedSpec>;

    playerCanPassTurnSpec = new PlayerCanPassTurnSpec(cardCanBePlayedSpecMock);
  });

  describe('.isSatisfiedBy', () => {
    describe('having an unexisting slot index', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameSlotIndexFixture: number;

      beforeAll(() => {
        activeGameFixture = ActiveGameFixtures.any;
        gameOptionsFixture = GameOptionsFixtures.any;
        gameSlotIndexFixture = -1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            playerCanPassTurnSpec.isSatisfiedBy(
              activeGameFixture,
              gameOptionsFixture,
              gameSlotIndexFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const expectedProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: expect.stringContaining(
              `Game slot ${gameSlotIndexFixture.toString()} not found`,
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having an active game with one player and currentTurnCardsPlayed true', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameSlotIndexFixture: number;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsOne,
          state: {
            ...ActiveGameFixtures.withSlotsOne.state,
            currentTurnCardsPlayed: true,
          },
        };
        gameOptionsFixture = GameOptionsFixtures.any;
        gameSlotIndexFixture = 0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = playerCanPassTurnSpec.isSatisfiedBy(
            activeGameFixture,
            gameOptionsFixture,
            gameSlotIndexFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });

    describe('having an active game with one player and currentTurnCardsPlayed false and currentTurnCardsDrawn false', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameSlotIndexFixture: number;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsOne,
          state: {
            ...ActiveGameFixtures.withSlotsOne.state,
            currentTurnCardsDrawn: false,
            currentTurnCardsPlayed: false,
          },
        };

        gameOptionsFixture = GameOptionsFixtures.any;
        gameSlotIndexFixture = 0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = playerCanPassTurnSpec.isSatisfiedBy(
            activeGameFixture,
            gameOptionsFixture,
            gameSlotIndexFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having an active game with one player and currentTurnCardsPlayed false and currentTurnCardsDrawn true, and game options with playCardIsMandatory false', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameSlotIndexFixture: number;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsOne,
          state: {
            ...ActiveGameFixtures.withSlotsOne.state,
            currentTurnCardsDrawn: true,
            currentTurnCardsPlayed: false,
          },
        };

        gameOptionsFixture =
          GameOptionsFixtures.withPlayCardIsMandatoryDisabled;
        gameSlotIndexFixture = 0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = playerCanPassTurnSpec.isSatisfiedBy(
            activeGameFixture,
            gameOptionsFixture,
            gameSlotIndexFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });

    describe('having an active game with one player and currentTurnCardsPlayed false and currentTurnCardsDrawn true, and game options with playCardIsMandatory true', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameSlotIndexFixture: number;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsOne,
          state: {
            ...ActiveGameFixtures.withSlotsOne.state,
            currentTurnCardsDrawn: true,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: undefined,
          },
        };

        gameOptionsFixture = GameOptionsFixtures.withPlayCardIsMandatoryEnabled;
        gameSlotIndexFixture = 0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = playerCanPassTurnSpec.isSatisfiedBy(
            activeGameFixture,
            gameOptionsFixture,
            gameSlotIndexFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });

    describe('having an active game with one player and currentTurnCardsPlayed false and currentTurnCardsDrawn true, and game options with playCardIsMandatory true and currentTurnSingleCardDraw', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameSlotIndexFixture: number;

      beforeAll(() => {
        activeGameFixture = {
          ...ActiveGameFixtures.withSlotsOne,
          state: {
            ...ActiveGameFixtures.withSlotsOne.state,
            currentTurnCardsDrawn: true,
            currentTurnCardsPlayed: false,
            currentTurnSingleCardDraw: CardFixtures.any,
          },
        };

        gameOptionsFixture = GameOptionsFixtures.withPlayCardIsMandatoryEnabled;
        gameSlotIndexFixture = 0;
      });

      describe('when called, and cardCanBePlayedSpec.isSatisfiedBy() returns true', () => {
        let result: unknown;

        beforeAll(() => {
          cardCanBePlayedSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          result = playerCanPassTurnSpec.isSatisfiedBy(
            activeGameFixture,
            gameOptionsFixture,
            gameSlotIndexFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardCanBePlayedSpec.isSatisfiedBy()', () => {
          expect(cardCanBePlayedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
            1,
          );
          expect(cardCanBePlayedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture.state.currentTurnSingleCardDraw,
            activeGameFixture,
            gameOptionsFixture,
          );
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });

      describe('when called, and cardCanBePlayedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          cardCanBePlayedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = playerCanPassTurnSpec.isSatisfiedBy(
            activeGameFixture,
            gameOptionsFixture,
            gameSlotIndexFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardCanBePlayedSpec.isSatisfiedBy()', () => {
          expect(cardCanBePlayedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
            1,
          );
          expect(cardCanBePlayedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            activeGameFixture.state.currentTurnSingleCardDraw,
            activeGameFixture,
            gameOptionsFixture,
          );
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });
  });
});
