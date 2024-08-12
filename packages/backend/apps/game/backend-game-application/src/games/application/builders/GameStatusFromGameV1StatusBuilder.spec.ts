import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { GameStatus } from '@cornie-js/backend-game-domain/games';

import { GameStatusFromGameV1StatusBuilder } from './GameStatusFromGameV1StatusBuilder';

describe(GameStatusFromGameV1StatusBuilder.name, () => {
  let gameStatusFromGameV1StatusBuilder: GameStatusFromGameV1StatusBuilder;

  beforeAll(() => {
    gameStatusFromGameV1StatusBuilder = new GameStatusFromGameV1StatusBuilder();
  });

  describe('.build', () => {
    describe('having an invalid game status', () => {
      let invalidGameStatusFixture: string;

      beforeAll(() => {
        invalidGameStatusFixture = 'invalid-game-status-fixture';
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameStatusFromGameV1StatusBuilder.build(invalidGameStatusFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.contractViolation,
            message: expect.stringContaining(
              'Expected game status v1 to be one of the following values:',
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe.each<[apiModels.GameV1['state']['status'], GameStatus]>([
      ['active', GameStatus.active],
      ['finished', GameStatus.finished],
      ['nonStarted', GameStatus.nonStarted],
    ])(
      'having a "%s" status',
      (gameStatusV1: string, expectedGameStatus: GameStatus) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = gameStatusFromGameV1StatusBuilder.build(gameStatusV1);
          });

          it('should return expected GameStatus', () => {
            expect(result).toBe(expectedGameStatus);
          });
        });
      },
    );
  });
});
