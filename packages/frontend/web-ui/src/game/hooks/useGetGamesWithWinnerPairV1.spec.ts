import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../helpers/buildGameWithWinnerUserPairArrayResult');
jest.mock('./useGetWinnerUserV1ForGames');

import { models as apiModels } from '@cornie-js/api-models';
import { GetGamesV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResult,
  UseQueryStateResult,
} from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { buildGameWithWinnerUserPairArrayResult } from '../helpers/buildGameWithWinnerUserPairArrayResult';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
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
  describe('when called', () => {
    let gamesV1ResultFixture: Either<string, apiModels.GameArrayV1> | null;
    let gameWithWinnerUserV1PairArrayResultFixture: Either<
      string,
      GameWithWinnerUserPair[]
    > | null;
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let useGetWinnerUserV1ForGamesResultFixture: UseGetWinnerUserV1ForGamesResult;
    let useQueryStateResultFixture: UseQueryStateResult<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<
      UseGetGamesWithWinnerPairV1Result,
      unknown
    >;

    beforeAll(() => {
      gamesV1ResultFixture = null;
      gameWithWinnerUserV1PairArrayResultFixture = null;
      getGamesV1ArgsFixture = {
        params: [
          {
            isPublic: 'false',
          },
        ],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };

      useGetWinnerUserV1ForGamesResultFixture = {
        result: null,
      };

      useQueryStateResultFixture = {
        data: undefined,
        error: undefined,
        isLoading: true,
        refetch: jest.fn(),
      };

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(gamesV1ResultFixture);

      (
        useGetWinnerUserV1ForGames as jest.Mock<
          typeof useGetWinnerUserV1ForGames
        >
      ).mockReturnValueOnce(useGetWinnerUserV1ForGamesResultFixture);

      (
        buildGameWithWinnerUserPairArrayResult as jest.Mock<
          typeof buildGameWithWinnerUserPairArrayResult
        >
      ).mockReturnValueOnce(gameWithWinnerUserV1PairArrayResultFixture);

      renderResult = renderHook(() =>
        useGetGamesWithWinnerPairV1(
          getGamesV1ArgsFixture,
          subscriptionOptionsFixture,
        ),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetGamesV1Query()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetGamesV1Query> = [
        getGamesV1ArgsFixture,
        subscriptionOptionsFixture,
      ];

      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should call useGetWinnerUserV1ForGames()', () => {
      expect(useGetWinnerUserV1ForGames).toHaveBeenCalledTimes(1);
      expect(useGetWinnerUserV1ForGames).toHaveBeenCalledWith(
        gamesV1ResultFixture,
        subscriptionOptionsFixture,
      );
    });

    it('should call buildGameWithWinnerUserPairArrayResult()', () => {
      expect(buildGameWithWinnerUserPairArrayResult).toHaveBeenCalledTimes(1);
      expect(buildGameWithWinnerUserPairArrayResult).toHaveBeenCalledWith(
        gamesV1ResultFixture,
        useGetWinnerUserV1ForGamesResultFixture.result,
      );
    });

    it('should return UseGetGamesWithWinnerPairV1Result', () => {
      const expectedResult: UseGetGamesWithWinnerPairV1Result = {
        result: gameWithWinnerUserV1PairArrayResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
