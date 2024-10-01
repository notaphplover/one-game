import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { isActiveGame } from './isActiveGame';

describe(isActiveGame.name, () => {
  describe.each<[string, apiModels.GameV1, boolean]>([
    [
      'an active game',
      {
        id: 'id-fixture',
        isPublic: true,
        state: {
          currentCard: {
            kind: 'wildDraw4',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 1,
          currentTurnCardsDrawn: true,
          currentTurnCardsPlayed: true,
          drawCount: 0,
          lastEventId: 'last-event-id-fixture',
          slots: [],
          status: 'active',
        },
      },
      true,
    ],
    [
      'a non active game',
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
          result = isActiveGame(gameFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
