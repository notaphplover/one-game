import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../user/hooks/useGetUser');

import { models as apiModels } from '@cornie-js/api-models';
import { renderHook, RenderHookResult } from '@testing-library/react';

import { Right } from '../../common/models/Either';
import { useGetUser, UseGetUserResult } from '../../user/hooks/useGetUser';
import {
  useGetMessageFinishedGame,
  UseGetMessageFinishedGameResult,
} from './useGetMessageFinishedGame';

describe(useGetMessageFinishedGame.name, () => {
  describe('when called,', () => {
    let gameFixture: apiModels.GameV1;
    let UseGetUserResultFixture: UseGetUserResult;
    let renderResult: RenderHookResult<
      UseGetMessageFinishedGameResult,
      unknown
    >;

    beforeAll(() => {
      gameFixture = {
        id: 'id-fixture',
        isPublic: false,
        state: {
          currentCard: {
            color: 'blue',
            kind: 'normal',
            number: 5,
          },
          currentColor: 'blue',
          currentDirection: 'clockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: false,
          currentTurnCardsPlayed: false,
          drawCount: 90,
          lastEventId: null,
          slots: [
            { cardsAmount: 2, userId: 'userId-fixture-1' },
            { cardsAmount: 3, userId: 'userId-fixture-2' },
          ],
          status: 'active',
          turnExpiresAt: 'turnExpiresAt-fixture',
        },
      };

      UseGetUserResultFixture = {
        queryResult: undefined,
        result: null,
      };

      (useGetUser as jest.Mock<typeof useGetUser>).mockReturnValue(
        UseGetUserResultFixture,
      );

      renderResult = renderHook(() => useGetMessageFinishedGame(gameFixture));
    });

    it('should call to useGetUser()', () => {
      expect(useGetUser).toHaveBeenCalledTimes(1);
      expect(useGetUser).toHaveBeenCalledWith(undefined);
    });

    it('should return expected message finished game undefined', () => {
      const expected: UseGetMessageFinishedGameResult = {
        messageFinishedGame: undefined,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and a game is finished', () => {
    let gameFixture: apiModels.GameV1;
    let messageFinishedGameFixture: string;
    let UseGetUserResultFixture: UseGetUserResult;
    let userV1Result: Right<apiModels.UserV1>;
    let renderResult: RenderHookResult<
      UseGetMessageFinishedGameResult,
      unknown
    >;

    beforeAll(() => {
      gameFixture = {
        id: 'id-fixture',
        isPublic: false,
        state: {
          slots: [
            { cardsAmount: 0, userId: 'userId-fixture-1' },
            { cardsAmount: 3, userId: 'userId-fixture-2' },
          ],
          status: 'finished',
        },
      };

      messageFinishedGameFixture = 'Finished game, the winner is name-fixture';

      userV1Result = {
        isRight: true,
        value: {
          active: true,
          id: 'userId-fixture-1',
          name: 'name-fixture',
        },
      };

      UseGetUserResultFixture = {
        queryResult: 'queryResult-fixture',
        result: userV1Result,
      };

      (useGetUser as jest.Mock<typeof useGetUser>).mockReturnValue(
        UseGetUserResultFixture,
      );

      renderResult = renderHook(() => useGetMessageFinishedGame(gameFixture));
    });

    it('should call to useGetUser()', () => {
      expect(useGetUser).toHaveBeenCalledTimes(3);
      expect(useGetUser).toHaveBeenNthCalledWith(1, undefined);
      expect(useGetUser).toHaveBeenNthCalledWith(2, 'userId-fixture-1');
      expect(useGetUser).toHaveBeenNthCalledWith(3, 'userId-fixture-1');
    });

    it('should return expected message finished game', () => {
      const expected: UseGetMessageFinishedGameResult = {
        messageFinishedGame: messageFinishedGameFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
