import { beforeAll, describe, expect, it } from '@jest/globals';

import { Left } from '@cornie-js/backend-common';

import { UserCreateQuery } from '..';
import { UserCreateQueryFixtures } from '../fixtures';
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
  });
});
