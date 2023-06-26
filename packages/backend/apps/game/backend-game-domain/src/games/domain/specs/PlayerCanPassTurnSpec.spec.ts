import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { GameOptionsFixtures } from '../fixtures/GameOptionsFixtures';
import { ActiveGame } from '../models/ActiveGame';
import { GameOptions } from '../models/GameOptions';
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
    describe('having an active game with one player with cards and currentTurnCardsPlayed false', () => {
      let activeGameFixture: ActiveGame;

      beforeAll(() => {
        activeGameFixture =
          ActiveGameFixtures.withSlotsOneAndCurrentTurnCardsPlayedFalse;
      });

      describe('having an existing gameSlotIndex', () => {
        let gameSlotIndex: number;

        beforeAll(() => {
          gameSlotIndex = 0;
        });

        describe('having a game options with playCardIsMandatory enabled', () => {
          let gameOptionsFixture: GameOptions;

          beforeAll(() => {
            gameOptionsFixture =
              GameOptionsFixtures.withPlayCardIsMandatoryEnabled;
          });

          describe('when called, and cardCanBePlayedSpec.isSatisfiedBy() returns true', () => {
            let result: unknown;

            beforeAll(() => {
              cardCanBePlayedSpecMock.isSatisfiedBy.mockReturnValue(true);

              result = playerCanPassTurnSpec.isSatisfiedBy(
                activeGameFixture,
                gameOptionsFixture,
                gameSlotIndex,
              );
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should call cardCanBePlayedSpec.isSatisfiedBy()', () => {
              expect(cardCanBePlayedSpecMock.isSatisfiedBy).toHaveBeenCalled();
            });

            it('should return false', () => {
              expect(result).toBe(false);
            });
          });
        });

        describe('having a game options with playCardIsMandatory disabled', () => {
          let gameOptionsFixture: GameOptions;

          beforeAll(() => {
            gameOptionsFixture =
              GameOptionsFixtures.withPlayCardIsMandatoryDisabled;
          });

          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = playerCanPassTurnSpec.isSatisfiedBy(
                activeGameFixture,
                gameOptionsFixture,
                gameSlotIndex,
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
      });

      describe('having an unexisting gameSlotIndex', () => {
        let gameSlotIndex: number;

        beforeAll(() => {
          gameSlotIndex = Infinity;
        });

        describe('when called', () => {
          let gameOptionsFixture: GameOptions;

          let result: unknown;

          beforeAll(() => {
            gameOptionsFixture = GameOptionsFixtures.any;

            try {
              playerCanPassTurnSpec.isSatisfiedBy(
                activeGameFixture,
                gameOptionsFixture,
                gameSlotIndex,
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
                `Game slot ${gameSlotIndex} not found`,
              ) as unknown as string,
            };

            expect(result).toBeInstanceOf(AppError);
            expect(result).toStrictEqual(
              expect.objectContaining(expectedProperties),
            );
          });
        });
      });
    });

    describe('having an active game with one player with cards and currentTurnCardsPlayed true', () => {
      let activeGameFixture: ActiveGame;

      beforeAll(() => {
        activeGameFixture =
          ActiveGameFixtures.withSlotsOneAndCurrentTurnCardsPlayedTrue;
      });

      describe('having an existing gameSlotIndex', () => {
        let gameSlotIndex: number;

        beforeAll(() => {
          gameSlotIndex = 0;
        });

        describe('when called', () => {
          let gameOptionsFixture: GameOptions;

          let result: unknown;

          beforeAll(() => {
            gameOptionsFixture = GameOptionsFixtures.any;

            result = playerCanPassTurnSpec.isSatisfiedBy(
              activeGameFixture,
              gameOptionsFixture,
              gameSlotIndex,
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
    });
  });
});
