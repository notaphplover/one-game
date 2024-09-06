import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../helpers/buildGameWithSpecPairArrayResult');
jest.mock('./useGetGameSpecsV1ForGames');

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
import { buildGameWithSpecPairArrayResult } from '../helpers/buildGameWithSpecPairArrayResult';
import { GameWithSpecPair } from '../models/GameWithSpecPair';
import {
  useGetGameSpecsV1ForGames,
  UseGetGameSpecsV1ForGamesResult,
} from './useGetGameSpecsV1ForGames';
import {
  useGetGamesWithSpecsV1,
  UseGetGamesWithSpecsV1Result,
} from './useGetGamesWithSpecsV1';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetGamesWithSpecsV1.name, () => {
  describe('when called', () => {
    let gamesV1ResultFixture: Either<string, apiModels.GameArrayV1> | null;
    let gameWithSpecV1PairArrayResultFixture: Either<
      string,
      GameWithSpecPair[]
    > | null;
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let useGetGameSpecsV1ForGamesResultFixture: UseGetGameSpecsV1ForGamesResult;
    let useQueryStateResultFixture: UseQueryStateResult<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<UseGetGamesWithSpecsV1Result, unknown>;

    beforeAll(() => {
      gamesV1ResultFixture = null;
      gameWithSpecV1PairArrayResultFixture = null;
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

      useGetGameSpecsV1ForGamesResultFixture = {
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
        useGetGameSpecsV1ForGames as jest.Mock<typeof useGetGameSpecsV1ForGames>
      ).mockReturnValueOnce(useGetGameSpecsV1ForGamesResultFixture);

      (
        buildGameWithSpecPairArrayResult as jest.Mock<
          typeof buildGameWithSpecPairArrayResult
        >
      ).mockReturnValueOnce(gameWithSpecV1PairArrayResultFixture);

      renderResult = renderHook(() =>
        useGetGamesWithSpecsV1(
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

    it('should call useGetGameSpecsV1ForGames()', () => {
      expect(useGetGameSpecsV1ForGames).toHaveBeenCalledTimes(1);
      expect(useGetGameSpecsV1ForGames).toHaveBeenCalledWith(
        gamesV1ResultFixture,
        subscriptionOptionsFixture,
      );
    });

    it('should call buildGameWithSpecPairArrayResult()', () => {
      expect(buildGameWithSpecPairArrayResult).toHaveBeenCalledTimes(1);
      expect(buildGameWithSpecPairArrayResult).toHaveBeenCalledWith(
        gamesV1ResultFixture,
        useGetGameSpecsV1ForGamesResultFixture.result,
      );
    });

    it('should return UseGetGamesWithSpecsV1Result', () => {
      const expectedResult: UseGetGamesWithSpecsV1Result = {
        result: gameWithSpecV1PairArrayResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
