import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesV1MineArgs,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResultV2,
  UseQueryStateResultV2,
} from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import {
  useGetGamesV1Mine,
  UseGetGamesV1MineResult,
} from './useGetGamesV1Mine';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetGamesV1Mine.name, () => {
  describe('when called', () => {
    let gameV1ResultFixture: apiModels.GameV1;
    let getGamesV1MineArgsFixture: GetGamesV1MineArgs;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getGamesV1MineResultFixture: Either<
      SerializableAppError | SerializedError,
      apiModels.GameArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<UseGetGamesV1MineResult, unknown>;

    beforeAll(() => {
      gameV1ResultFixture = {
        id: 'game-id-fixture',
        isPublic: false,
        name: 'name-game-fixture',
        state: {
          slots: [],
          status: 'finished',
        },
      };

      getGamesV1MineArgsFixture = {
        params: [
          {
            status: 'finished',
          },
        ],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
        skip: true,
      };

      useQueryStateResultFixture = {
        data: undefined,
        error: undefined,
        isLoading: true,
        refetch: jest.fn(),
      };

      getGamesV1MineResultFixture = {
        isRight: true,
        value: [gameV1ResultFixture],
      };

      (
        cornieApi.useGetGamesV1MineQuery as jest.Mock<
          typeof cornieApi.useGetGamesV1MineQuery
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(getGamesV1MineResultFixture);

      renderResult = renderHook(() =>
        useGetGamesV1Mine(
          getGamesV1MineArgsFixture,
          subscriptionOptionsFixture,
        ),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetGamesV1MineQuery()', () => {
      const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
        ...subscriptionOptionsFixture,
        skip: true,
      };

      const expectedGetGamesV1MineArgs: GetGamesV1MineArgs = {
        params: [
          {
            status: 'finished',
          },
        ],
      };
      expect(cornieApi.useGetGamesV1MineQuery).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1MineQuery).toHaveBeenCalledWith(
        expectedGetGamesV1MineArgs,
        expectedSubscriptionOptions,
      );
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetGamesV1MineResult', () => {
      const expectedResult: UseGetGamesV1MineResult = {
        result: getGamesV1MineResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
