import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { isFinishedGame } from './isFinishedGame';

describe(isFinishedGame.name, () => {
  describe.each<[string, apiModels.GameV1, boolean]>([
    [
      'a finished game',
      {
        id: 'id-fixture',
        isPublic: true,
        state: {
          slots: [],
          status: 'finished',
        },
      },
      true,
    ],
    [
      'a non finished game',
      {
        id: 'id-fixture',
        isPublic: true,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      },
      false,
    ],
  ])(
    'having %s game',
    (_: string, gameFixture: apiModels.GameV1, expectedResult: boolean) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isFinishedGame(gameFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
