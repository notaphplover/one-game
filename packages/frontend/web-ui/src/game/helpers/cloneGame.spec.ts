import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { cloneGame } from './cloneGame';

describe(cloneGame.name, () => {
  describe('having an active game', () => {
    let gameFixture: apiModels.ActiveGameV1;

    beforeAll(() => {
      gameFixture = {
        id: 'game-id-fixture',
        isPublic: true,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: true,
          currentTurnCardsPlayed: true,
          drawCount: 0,
          lastEventId: 'last-event-id',
          slots: [],
          status: 'active',
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = cloneGame(gameFixture);
      });

      it('should return a cloned game', () => {
        expect(result).not.toBe(gameFixture);
        expect(result).toStrictEqual(gameFixture);
      });
    });
  });

  describe('having a finished game', () => {
    let gameFixture: apiModels.FinishedGameV1;

    beforeAll(() => {
      gameFixture = {
        id: 'game-id-fixture',
        isPublic: true,
        state: {
          slots: [],
          status: 'finished',
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = cloneGame(gameFixture);
      });

      it('should return a cloned game', () => {
        expect(result).not.toBe(gameFixture);
        expect(result).toStrictEqual(gameFixture);
      });
    });
  });
});
