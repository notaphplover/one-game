import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import { GetUsersV1Args } from '@cornie-js/frontend-api-rtk-query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResult,
  UseQueryStateResult,
} from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { useGetUsersV1, UseGetUsersV1Result } from './useGetUsersV1';
import { UseQuerySubscriptionOptions } from './useGetWinnerUserV1ForGames';

describe(useGetUsersV1.name, () => {
  describe('when called', () => {
    let gameV1ResultFixture: apiModels.GameV1;
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getUsersV1ResultFixture: Either<
      string,
      apiModels.MaybeUserArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResult<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<UseGetUsersV1Result, unknown>;

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

      getUsersV1ArgsFixture = {
        params: [
          {
            gameId: [gameV1ResultFixture.id],
            sort: 'ids',
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

      getUsersV1ResultFixture = {
        isRight: true,
        value: [
          {
            active: true,
            id: 'user-id-fixture',
            name: 'name-user-fixture',
          },
        ],
      };

      (
        cornieApi.useGetUsersV1Query as jest.Mock<
          typeof cornieApi.useGetUsersV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(getUsersV1ResultFixture);

      renderResult = renderHook(() =>
        useGetUsersV1(getUsersV1ArgsFixture, subscriptionOptionsFixture),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetUsersV1Query()', () => {
      const userSortOptionV1: apiModels.UserSortOptionV1 = 'ids';
      const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
        ...subscriptionOptionsFixture,
        skip: true,
      };

      const expectedGetWinnerUserV1Args: GetUsersV1Args = {
        params: [
          {
            gameId: [gameV1ResultFixture.id],
            sort: userSortOptionV1,
          },
        ],
      };
      expect(cornieApi.useGetUsersV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetUsersV1Query).toHaveBeenCalledWith(
        expectedGetWinnerUserV1Args,
        expectedSubscriptionOptions,
      );
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetUsersV1Result', () => {
      const expectedResult: UseGetUsersV1Result = {
        result: getUsersV1ResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
