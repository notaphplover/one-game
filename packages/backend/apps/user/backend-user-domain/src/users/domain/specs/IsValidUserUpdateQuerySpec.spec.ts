import { beforeAll, describe, expect, it } from '@jest/globals';

import { Left, Right } from '@cornie-js/backend-common';

import { UserUpdateQueryFixtures } from '../fixtures/UserUpdateQueryFixtures';
import { UserUpdateQuery } from '../query/UserUpdateQuery';
import { IsValidUserUpdateQuerySpec } from './IsValidUserUpdateQuerySpec';

describe(IsValidUserUpdateQuerySpec.name, () => {
  let isValidUserUpdateQuerySpec: IsValidUserUpdateQuerySpec;

  beforeAll(() => {
    isValidUserUpdateQuerySpec = new IsValidUserUpdateQuerySpec();
  });

  describe('.isSatisfiedOrReport', () => {
    describe('having a UserUpdateQuery with empty name', () => {
      let userUpdateQueryFixture: UserUpdateQuery;

      beforeAll(() => {
        userUpdateQueryFixture = UserUpdateQueryFixtures.withNameEmpty;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isValidUserUpdateQuerySpec.isSatisfiedOrReport(
            userUpdateQueryFixture,
          );
        });

        it('should return a report', () => {
          const expected: Left<string[]> = {
            isRight: false,
            value: ['Expected a non empty name'],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a valid UserUpdateQuery', () => {
      let userUpdateQueryFixture: UserUpdateQuery;

      beforeAll(() => {
        userUpdateQueryFixture = UserUpdateQueryFixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isValidUserUpdateQuerySpec.isSatisfiedOrReport(
            userUpdateQueryFixture,
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
