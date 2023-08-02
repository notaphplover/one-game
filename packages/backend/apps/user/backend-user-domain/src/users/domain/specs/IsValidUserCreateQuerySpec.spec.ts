import { beforeAll, describe, expect, it } from '@jest/globals';

import { Left, Right } from '@cornie-js/backend-common';

import { UserCreateQueryFixtures } from '../fixtures/UserCreateQueryFixtures';
import { UserCreateQuery } from '../query/UserCreateQuery';
import { IsValidUserCreateQuerySpec } from './IsValidUserCreateQuerySpec';

describe(IsValidUserCreateQuerySpec.name, () => {
  let isValidUserCreateQuerySpec: IsValidUserCreateQuerySpec;

  beforeAll(() => {
    isValidUserCreateQuerySpec = new IsValidUserCreateQuerySpec();
  });

  describe('.isSatisfiedOrReport', () => {
    describe('having a UserCreateQuery with wrong email', () => {
      let userCreateQueryFixture: UserCreateQuery;

      beforeAll(() => {
        userCreateQueryFixture = UserCreateQueryFixtures.withEmailInvalid;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isValidUserCreateQuerySpec.isSatisfiedOrReport(
            userCreateQueryFixture,
          );
        });

        it('should return a report', () => {
          const expected: Left<string[]> = {
            isRight: false,
            value: [`"${userCreateQueryFixture.email}" is not a valid email`],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a UserCreateQuery with empty name', () => {
      let userCreateQueryFixture: UserCreateQuery;

      beforeAll(() => {
        userCreateQueryFixture = UserCreateQueryFixtures.withNameEmpty;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isValidUserCreateQuerySpec.isSatisfiedOrReport(
            userCreateQueryFixture,
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

    describe('having a valid UserCreateQuery', () => {
      let userCreateQueryFixture: UserCreateQuery;

      beforeAll(() => {
        userCreateQueryFixture = UserCreateQueryFixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isValidUserCreateQuerySpec.isSatisfiedOrReport(
            userCreateQueryFixture,
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
