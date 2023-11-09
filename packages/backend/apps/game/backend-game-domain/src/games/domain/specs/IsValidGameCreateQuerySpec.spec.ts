import { beforeAll, describe, expect, it } from '@jest/globals';

import { Left, Right } from '@cornie-js/backend-common';

import { GameCreateQueryFixtures } from '../fixtures';
import { GameCreateQuery } from '../query/GameCreateQuery';
import { IsValidGameCreateQuerySpec } from './IsValidGameCreateQuerySpec';

describe(IsValidGameCreateQuerySpec.name, () => {
  let isValidGameCreateQuerySpec: IsValidGameCreateQuerySpec;

  beforeAll(() => {
    isValidGameCreateQuerySpec = new IsValidGameCreateQuerySpec();
  });

  describe('.isSatisfiedOrReport', () => {
    describe('having a GameCreateQuery with a non integer game amount in the right range', () => {
      let gameCreateQueryFixture: GameCreateQuery;

      beforeAll(() => {
        gameCreateQueryFixture =
          GameCreateQueryFixtures.withSpecWithGameSlotAmountTwoAndAHalf;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isValidGameCreateQuerySpec.isSatisfiedOrReport(
            gameCreateQueryFixture,
          );
        });

        it('should return a Left', () => {
          const expected: Left<string[]> = {
            isRight: false,
            value: ['Expecting an integer game slots amount'],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameCreateQuery with an integer game amount out of the right range', () => {
      let gameCreateQueryFixture: GameCreateQuery;

      beforeAll(() => {
        gameCreateQueryFixture =
          GameCreateQueryFixtures.withSpecWithGameSlotAmountZero;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isValidGameCreateQuerySpec.isSatisfiedOrReport(
            gameCreateQueryFixture,
          );
        });

        it('should return a Left', () => {
          const expected: Left<string[]> = {
            isRight: false,
            value: ['Expecting a game slots amount between 2 and 10'],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameCreateQuery with an integer game amount in of the right range', () => {
      let gameCreateQueryFixture: GameCreateQuery;

      beforeAll(() => {
        gameCreateQueryFixture =
          GameCreateQueryFixtures.withSpecWithGameSlotAmountTwo;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isValidGameCreateQuerySpec.isSatisfiedOrReport(
            gameCreateQueryFixture,
          );
        });

        it('should return a Right', () => {
          const expected: Right<undefined> = {
            isRight: true,
            value: undefined,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
