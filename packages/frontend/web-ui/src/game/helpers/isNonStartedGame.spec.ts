import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { isNonStartedGame } from './isNonStartedGame';

describe(isNonStartedGame.name, () => {
  describe.each<[string, apiModels.GameV1, boolean]>([
    [
      'a non started game',
      {
        id: 'id-fixture',
        isPublic: true,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      },
      true,
    ],
    [
      'a non non started game',
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
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
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
          result = isNonStartedGame(gameFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
