import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { NonStartedGame } from '../entities/NonStartedGame';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameService } from './GameService';

describe(GameService.name, () => {
  let gameService: GameService;

  beforeAll(() => {
    gameService = new GameService();
  });

  describe('.getGameSlotOrThrow', () => {
    describe('having a game with a single game slot', () => {
      let gameFixture: NonStartedGame;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.withGameSlotsOne;
      });

      describe('having an existing index', () => {
        let slotIndexFixture: number;

        beforeAll(() => {
          slotIndexFixture = 0;
        });

        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = gameService.getGameSlotOrThrow(
              gameFixture,
              slotIndexFixture,
            );
          });

          it('should return a GameSlot', () => {
            expect(result).toBe(gameFixture.state.slots[0]);
          });
        });
      });

      describe('having a non existing index', () => {
        let slotIndexFixture: number;

        beforeAll(() => {
          slotIndexFixture = -1;
        });

        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              gameService.getGameSlotOrThrow(gameFixture, slotIndexFixture);
            } catch (error: unknown) {
              result = error;
            }
          });

          it('should throw an Error', () => {
            const expectedErrorProperties: Partial<AppError> = {
              kind: AppErrorKind.unknown,
              message:
                'Expecting a game slot at index "-1", none found instead.',
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
});
