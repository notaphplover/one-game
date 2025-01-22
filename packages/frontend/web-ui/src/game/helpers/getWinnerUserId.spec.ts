import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { getWinnerUserId } from './getWinnerUserId';

describe(getWinnerUserId.name, () => {
  let gameFixture: apiModels.GameV1 | undefined;

  describe('having a finished game', () => {
    let result: string | undefined;

    beforeAll(() => {
      gameFixture = {
        id: 'game-id-fixture',
        isPublic: true,
        state: {
          slots: [
            {
              cardsAmount: 0,
              userId: 'userId-1-fixture',
            },
            {
              cardsAmount: 3,
              userId: 'userId-2-fixture',
            },
          ],
          status: 'finished',
        },
      };
      result = getWinnerUserId(gameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an userId', () => {
      expect(result).toBe('userId-1-fixture');
    });
  });

  describe('having a undefined game', () => {
    let result: string | undefined;

    beforeAll(() => {
      gameFixture = undefined;
      result = getWinnerUserId(gameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an undefined userId', () => {
      expect(result).toBeUndefined();
    });
  });
});
