import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../helpers/buildGameWithWinnerUserPairArrayResult');
jest.mock('./useGetGamesV1Mine');
jest.mock('./useGetWinnerUserV1ForGames');

import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesV1MineArgs,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import { Either } from '../../common/models/Either';
import { buildGameWithWinnerUserPairArrayResult } from '../helpers/buildGameWithWinnerUserPairArrayResult';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import {
  useGetGamesV1Mine,
  UseGetGamesV1MineResult,
} from './useGetGamesV1Mine';
import {
  useGetGamesWithWinnerPairV1,
  UseGetGamesWithWinnerPairV1Result,
} from './useGetGamesWithWinnerPairV1';
import {
  useGetWinnerUserV1ForGames,
  UseGetWinnerUserV1ForGamesResult,
} from './useGetWinnerUserV1ForGames';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetGamesWithWinnerPairV1.name, () => {
  describe('when called, and and useGetGamesWithWinnerPairV1() returns a GameWithWinnerUserPair[]', () => {
    let gameV1ResultFixture: apiModels.GameV1;
    let gamesV1MineResultFixture: UseGetGamesV1MineResult;
    let gameWithWinnerUserV1PairArrayResultFixture: Either<
      SerializableAppError | SerializedError,
      GameWithWinnerUserPair[]
    > | null;
    let getGamesV1MineArgsFixture: GetGamesV1MineArgs;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let userV1ResultFixture: apiModels.UserV1;
    let winnerUserV1Result: UseGetWinnerUserV1ForGamesResult;

    let renderResult: RenderHookResult<
      UseGetGamesWithWinnerPairV1Result,
      unknown
    >;

    beforeAll(() => {
      gameV1ResultFixture = {
        id: 'game-id-fixture',
        isPublic: false,
        name: 'name-game-fixture',
        state: {
          slots: [
            { cardsAmount: 0, userId: 'user-id-1-fixture' },
            { cardsAmount: 2, userId: 'user-id-2-fixture' },
          ],
          status: 'finished',
        },
      };

      gamesV1MineResultFixture = {
        result: {
          isRight: true,
          value: [gameV1ResultFixture],
        },
      };

      userV1ResultFixture = {
        active: true,
        id: 'user-id-fixture',
        name: 'name-user-fixture',
      };

      winnerUserV1Result = {
        result: {
          isRight: true,
          value: [userV1ResultFixture],
        },
      };

      gameWithWinnerUserV1PairArrayResultFixture = {
        isRight: true,
        value: [
          {
            game: gameV1ResultFixture,
            winnerUser: userV1ResultFixture,
          },
        ],
      };

      getGamesV1MineArgsFixture = {
        params: [
          {
            isPublic: 'false',
            status: 'finished',
          },
        ],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };

      (
        useGetGamesV1Mine as jest.Mock<typeof useGetGamesV1Mine>
      ).mockReturnValue(gamesV1MineResultFixture);

      (
        useGetWinnerUserV1ForGames as jest.Mock<
          typeof useGetWinnerUserV1ForGames
        >
      ).mockReturnValueOnce(winnerUserV1Result);

      (
        buildGameWithWinnerUserPairArrayResult as jest.Mock<
          typeof buildGameWithWinnerUserPairArrayResult
        >
      ).mockReturnValueOnce(gameWithWinnerUserV1PairArrayResultFixture);

      renderResult = renderHook(() =>
        useGetGamesWithWinnerPairV1(
          getGamesV1MineArgsFixture,
          subscriptionOptionsFixture,
        ),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useGetGamesV1Mine()', () => {
      expect(useGetGamesV1Mine).toHaveBeenCalledTimes(1);
      expect(useGetGamesV1Mine).toHaveBeenCalledWith(
        getGamesV1MineArgsFixture,
        subscriptionOptionsFixture,
      );
    });

    it('should call useGetWinnerUserV1ForGames()', () => {
      expect(useGetWinnerUserV1ForGames).toHaveBeenCalledTimes(1);
      expect(useGetWinnerUserV1ForGames).toHaveBeenCalledWith(
        gamesV1MineResultFixture.result,
        subscriptionOptionsFixture,
      );
    });

    it('should call buildGameWithWinnerUserPairArrayResult()', () => {
      expect(buildGameWithWinnerUserPairArrayResult).toHaveBeenCalledTimes(1);
      expect(buildGameWithWinnerUserPairArrayResult).toHaveBeenCalledWith(
        gamesV1MineResultFixture.result,
        winnerUserV1Result.result,
      );
    });

    it('should return UseGetGamesWithWinnerPairV1Result', () => {
      const expectedResult: UseGetGamesWithWinnerPairV1Result = {
        result: gameWithWinnerUserV1PairArrayResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and useGetGamesWithWinnerPairV1() returns an error', () => {
    let gameV1ResultFixture: apiModels.GameV1;
    let gamesV1MineResultFixture: UseGetGamesV1MineResult;
    let gameWithWinnerUserV1PairArrayResultFixture: Either<
      SerializableAppError | SerializedError,
      GameWithWinnerUserPair[]
    > | null;
    let getGamesV1MineArgsFixture: GetGamesV1MineArgs;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let winnerUserV1Result: UseGetWinnerUserV1ForGamesResult;

    let renderResult: RenderHookResult<
      UseGetGamesWithWinnerPairV1Result,
      unknown
    >;

    beforeAll(() => {
      gameV1ResultFixture = {
        id: 'game-id-fixture',
        isPublic: false,
        name: 'name-game-fixture',
        state: {
          slots: [
            { cardsAmount: 0, userId: 'user-id-1-fixture' },
            { cardsAmount: 2, userId: 'user-id-2-fixture' },
          ],
          status: 'finished',
        },
      };

      gamesV1MineResultFixture = {
        result: {
          isRight: true,
          value: [gameV1ResultFixture],
        },
      };

      winnerUserV1Result = {
        result: {
          isRight: false,
          value: {
            message: 'error-message-fixture',
          },
        },
      };

      gameWithWinnerUserV1PairArrayResultFixture = {
        isRight: false,
        value: {
          message: 'error-message-fixture',
        },
      };

      getGamesV1MineArgsFixture = {
        params: [
          {
            isPublic: 'false',
            status: 'finished',
          },
        ],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };

      (
        useGetGamesV1Mine as jest.Mock<typeof useGetGamesV1Mine>
      ).mockReturnValue(gamesV1MineResultFixture);

      (
        useGetWinnerUserV1ForGames as jest.Mock<
          typeof useGetWinnerUserV1ForGames
        >
      ).mockReturnValueOnce(winnerUserV1Result);

      (
        buildGameWithWinnerUserPairArrayResult as jest.Mock<
          typeof buildGameWithWinnerUserPairArrayResult
        >
      ).mockReturnValueOnce(gameWithWinnerUserV1PairArrayResultFixture);

      renderResult = renderHook(() =>
        useGetGamesWithWinnerPairV1(
          getGamesV1MineArgsFixture,
          subscriptionOptionsFixture,
        ),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useGetGamesV1Mine()', () => {
      expect(useGetGamesV1Mine).toHaveBeenCalledTimes(1);
      expect(useGetGamesV1Mine).toHaveBeenCalledWith(
        getGamesV1MineArgsFixture,
        subscriptionOptionsFixture,
      );
    });

    it('should call useGetWinnerUserV1ForGames()', () => {
      expect(useGetWinnerUserV1ForGames).toHaveBeenCalledTimes(1);
      expect(useGetWinnerUserV1ForGames).toHaveBeenCalledWith(
        gamesV1MineResultFixture.result,
        subscriptionOptionsFixture,
      );
    });

    it('should call buildGameWithWinnerUserPairArrayResult()', () => {
      expect(buildGameWithWinnerUserPairArrayResult).toHaveBeenCalledTimes(1);
      expect(buildGameWithWinnerUserPairArrayResult).toHaveBeenCalledWith(
        gamesV1MineResultFixture.result,
        winnerUserV1Result.result,
      );
    });

    it('should return UseGetGamesWithWinnerPairV1Result an error', () => {
      const expectedResult: UseGetGamesWithWinnerPairV1Result = {
        result: gameWithWinnerUserV1PairArrayResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
