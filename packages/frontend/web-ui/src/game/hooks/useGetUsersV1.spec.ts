import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import {
  GetUsersV1Args,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResultV2,
  UseQueryStateResultV2,
} from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { useGetUsersV1, UseGetUsersV1Result } from './useGetUsersV1';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetUsersV1.name, () => {
  describe('when called, and getUsersV1() returns a GetUsersV1Result with 200 HTTP status code', () => {
    let gameV1ResultFixture: apiModels.GameV1;
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getUsersV1ResultFixture: Either<
      SerializableAppError | SerializedError,
      apiModels.MaybeUserArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
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
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
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
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetUsersV1Result with winner user', () => {
      const expectedResult: UseGetUsersV1Result = {
        result: getUsersV1ResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and getUsersV1() returns a GetUsersV1Result with 401 HTTP status code', () => {
    let gameV1ResultFixture: apiModels.GameV1;
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getUsersV1ResultFixture: Either<
      SerializableAppError | SerializedError,
      apiModels.MaybeUserArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
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
        isRight: false,
        value: {
          kind: AppErrorKind.missingCredentials,
          message: 'missing-credentials-fixture',
        },
      };

      (
        cornieApi.useGetUsersV1Query as jest.Mock<
          typeof cornieApi.useGetUsersV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
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
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetUsersV1Result with missing credentials message', () => {
      const expectedResult: UseGetUsersV1Result = {
        result: getUsersV1ResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and getUsersV1() returns a GetUsersV1Result with 403 HTTP status code', () => {
    let gameV1ResultFixture: apiModels.GameV1;
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getUsersV1ResultFixture: Either<
      SerializableAppError | SerializedError,
      apiModels.MaybeUserArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
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
        isRight: false,
        value: {
          kind: AppErrorKind.invalidCredentials,
          message: 'invalid-credentials-fixture',
        },
      };

      (
        cornieApi.useGetUsersV1Query as jest.Mock<
          typeof cornieApi.useGetUsersV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
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
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetUsersV1Result with invalid credentials message', () => {
      const expectedResult: UseGetUsersV1Result = {
        result: getUsersV1ResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
