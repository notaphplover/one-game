import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { getGameSlotIndex } from './getGameSlotIndex';

describe(getGameSlotIndex.name, () => {
  describe('having a user and a game without a slot belonging to that user', () => {
    let gameFixture: apiModels.GameV1;

    let userFixture: apiModels.UserV1;

    beforeAll(() => {
      gameFixture = {
        id: 'id-fixture',
        isPublic: true,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      };

      userFixture = {
        active: true,
        id: 'id-fixture',
        name: 'name-fixture',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getGameSlotIndex(gameFixture, userFixture);
      });

      it('should return expected result', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a user and a game with a slot belonging to that user', () => {
    let gameFixture: apiModels.GameV1;

    let userFixture: apiModels.UserV1;

    beforeAll(() => {
      userFixture = {
        active: true,
        id: 'id-fixture',
        name: 'name-fixture',
      };

      gameFixture = {
        id: 'id-fixture',
        isPublic: true,
        state: {
          slots: [
            {
              userId: userFixture.id,
            },
          ],
          status: 'nonStarted',
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getGameSlotIndex(gameFixture, userFixture);
      });

      it('should return expected result', () => {
        expect(result).toBe(0);
      });
    });
  });
});
