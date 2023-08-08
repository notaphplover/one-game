import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { IsGameFinishedSpec } from './IsGameFinishedSpec';

describe(IsGameFinishedSpec.name, () => {
  let isGameFinishedSpec: IsGameFinishedSpec;

  beforeAll(() => {
    isGameFinishedSpec = new IsGameFinishedSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe('having an active game with no current playing slot', () => {
      let activeGameFixture: ActiveGame;

      beforeAll(() => {
        const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;

        activeGameFixture = {
          ...anyActiveGameFixture,
          state: {
            ...anyActiveGameFixture.state,
            currentPlayingSlotIndex: -1,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            isGameFinishedSpec.isSatisfiedBy(activeGameFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: expect.stringContaining(
              'Expecting a game slot at index',
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having an active game with current playing slot with cards', () => {
      let activeGameFixture: ActiveGame;

      beforeAll(() => {
        activeGameFixture = ActiveGameFixtures.withSlotsOneWithCards;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isGameFinishedSpec.isSatisfiedBy(activeGameFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having an active game with current playing slot with no cards', () => {
      let activeGameFixture: ActiveGame;

      beforeAll(() => {
        activeGameFixture = ActiveGameFixtures.withSlotsOneWithNoCards;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isGameFinishedSpec.isSatisfiedBy(activeGameFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });
  });
});
