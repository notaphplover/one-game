import { beforeAll, describe, expect, it } from '@jest/globals';

import { UserFixtures } from '../fixtures/UserFixtures';
import { User } from '../models/User';
import { UserCanCreateCodeSpec } from './UserCanCreateCodeSpec';

describe(UserCanCreateCodeSpec.name, () => {
  let userCanCreateAuthSpec: UserCanCreateCodeSpec;

  beforeAll(() => {
    userCanCreateAuthSpec = new UserCanCreateCodeSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe('having a User with active true', () => {
      let userFixture: User;

      beforeAll(() => {
        userFixture = UserFixtures.withActiveTrue;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userCanCreateAuthSpec.isSatisfiedBy(userFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having a User with active false', () => {
      let userFixture: User;

      beforeAll(() => {
        userFixture = UserFixtures.withActiveFalse;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userCanCreateAuthSpec.isSatisfiedBy(userFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });
  });
});
