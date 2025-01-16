import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesV1Args,
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
import { useGetGamesV1, UseGetGamesV1Result } from './useGetGamesV1';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetGamesV1.name, () => {
  describe('when called, and getGamesV1() returns a UseGetGamesV1Result with 200 HTTP status code', () => {
    let gameV1ResultFixture: apiModels.GameV1;
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getGamesV1ResultFixture: Either<
      SerializableAppError | SerializedError,
      apiModels.GameArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<UseGetGamesV1Result, unknown>;

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

      getGamesV1ArgsFixture = {
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

      getGamesV1ResultFixture = {
        isRight: true,
        value: [gameV1ResultFixture],
      };

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(getGamesV1ResultFixture);

      renderResult = renderHook(() =>
        useGetGamesV1(getGamesV1ArgsFixture, subscriptionOptionsFixture),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetGamesV1Query()', () => {
      const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
        ...subscriptionOptionsFixture,
        skip: true,
      };

      const expectedGetGamesV1Args: GetGamesV1Args = {
        params: [
          {
            status: 'finished',
          },
        ],
      };
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledWith(
        expectedGetGamesV1Args,
        expectedSubscriptionOptions,
      );
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetGamesV1Result', () => {
      const expectedResult: UseGetGamesV1Result = {
        result: getGamesV1ResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and getGamesV1() returns a UseGetGamesV1Result with 400 HTTP status code', () => {
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getGamesV1ResultFixture: Either<
      SerializableAppError | SerializedError,
      apiModels.GameArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<UseGetGamesV1Result, unknown>;

    beforeAll(() => {
      getGamesV1ArgsFixture = {
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

      getGamesV1ResultFixture = {
        isRight: false,
        value: {
          kind: AppErrorKind.contractViolation,
          message: 'contractViolation-fixture',
        },
      };

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(getGamesV1ResultFixture);

      renderResult = renderHook(() =>
        useGetGamesV1(getGamesV1ArgsFixture, subscriptionOptionsFixture),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetGamesV1Query()', () => {
      const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
        ...subscriptionOptionsFixture,
        skip: true,
      };

      const expectedGetGamesV1Args: GetGamesV1Args = {
        params: [
          {
            status: 'finished',
          },
        ],
      };
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledWith(
        expectedGetGamesV1Args,
        expectedSubscriptionOptions,
      );
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetGamesV1Result with contract violation message', () => {
      const expectedResult: UseGetGamesV1Result = {
        result: getGamesV1ResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and getGamesV1() returns a UseGetGamesV1Result with 401 HTTP status code', () => {
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getGamesV1ResultFixture: Either<
      SerializableAppError | SerializedError,
      apiModels.GameArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<UseGetGamesV1Result, unknown>;

    beforeAll(() => {
      getGamesV1ArgsFixture = {
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

      getGamesV1ResultFixture = {
        isRight: false,
        value: {
          kind: AppErrorKind.missingCredentials,
          message: 'missingCredentials-fixture',
        },
      };

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(getGamesV1ResultFixture);

      renderResult = renderHook(() =>
        useGetGamesV1(getGamesV1ArgsFixture, subscriptionOptionsFixture),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetGamesV1Query()', () => {
      const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
        ...subscriptionOptionsFixture,
        skip: true,
      };

      const expectedGetGamesV1Args: GetGamesV1Args = {
        params: [
          {
            status: 'finished',
          },
        ],
      };
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledWith(
        expectedGetGamesV1Args,
        expectedSubscriptionOptions,
      );
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetGamesV1Result with missing credentials message', () => {
      const expectedResult: UseGetGamesV1Result = {
        result: getGamesV1ResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and getGamesV1() returns a UseGetGamesV1Result with 403 HTTP status code', () => {
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let getGamesV1ResultFixture: Either<
      SerializableAppError | SerializedError,
      apiModels.GameArrayV1
    > | null;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<UseGetGamesV1Result, unknown>;

    beforeAll(() => {
      getGamesV1ArgsFixture = {
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

      getGamesV1ResultFixture = {
        isRight: false,
        value: {
          kind: AppErrorKind.invalidCredentials,
          message: 'invalidCredentials-fixture',
        },
      };

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(getGamesV1ResultFixture);

      renderResult = renderHook(() =>
        useGetGamesV1(getGamesV1ArgsFixture, subscriptionOptionsFixture),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetGamesV1Query()', () => {
      const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
        ...subscriptionOptionsFixture,
        skip: true,
      };

      const expectedGetGamesV1Args: GetGamesV1Args = {
        params: [
          {
            status: 'finished',
          },
        ],
      };
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledWith(
        expectedGetGamesV1Args,
        expectedSubscriptionOptions,
      );
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return UseGetGamesV1Result with invalid credentials message', () => {
      const expectedResult: UseGetGamesV1Result = {
        result: getGamesV1ResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
