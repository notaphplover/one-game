import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import { GetGamesV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Right } from '../../common/models/Either';
import {
  useGetGamesWithSpecsV1,
  UseGetGamesWithSpecsV1Result,
} from './useGetGamesWithSpecsV1';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetGamesWithSpecsV1.name, () => {
  describe('when called, and useGetGamesV1() returns null and useGetGamesSpecsV1 returns null', () => {
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    let renderResult: RenderHookResult<UseGetGamesWithSpecsV1Result, unknown>;

    beforeAll(() => {
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

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null);

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

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetGamesV1Query> = [
        getGamesV1ArgsFixture,
        subscriptionOptionsFixture,
      ];

      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useGetGamesSpecsV1Query()', () => {
      const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';

      const expectedParams: Parameters<
        typeof cornieApi.useGetGamesSpecsV1Query
      > = [
        {
          params: [
            {
              gameId: [],
              sort: gameSpecSortOptionV1,
            },
          ],
        },
        {
          ...subscriptionOptionsFixture,
          skip: true,
        },
      ];

      expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should return UseGetGamesWithSpecsV1Result', () => {
      const expectedResult: UseGetGamesWithSpecsV1Result = {
        result: null,
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and useGetGamesV1() returns a Right with a game and useGetGamesSpecsV1 returns Right with a game spec', () => {
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    let gameV1Fixture: apiModels.GameV1;
    let gameSpecV1Fixture: apiModels.GameSpecV1;

    let renderResult: RenderHookResult<UseGetGamesWithSpecsV1Result, unknown>;

    beforeAll(() => {
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

      gameV1Fixture = {
        id: 'game-id-fixture',
        isPublic: true,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      };

      gameSpecV1Fixture = {
        cardSpecs: [],
        gameId: 'game-id-fixture',
        gameSlotsAmount: 2,
        options: {
          chainDraw2Draw2Cards: false,
          chainDraw2Draw4Cards: false,
          chainDraw4Draw2Cards: false,
          chainDraw4Draw4Cards: false,
          playCardIsMandatory: false,
          playMultipleSameCards: false,
          playWildDraw4IfNoOtherAlternative: true,
        },
      };

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce({
        data: undefined,
        error: undefined,
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: jest.fn<any>(),
      });

      (
        cornieApi.useGetGamesSpecsV1Query as jest.Mock<
          typeof cornieApi.useGetGamesSpecsV1Query
        >
      ).mockReturnValueOnce({
        data: undefined,
        error: undefined,
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: jest.fn<any>(),
      });

      const getGamesV1Result: Right<apiModels.GameArrayV1> = {
        isRight: true,
        value: [gameV1Fixture],
      };

      const getGamesSpecsV1Result: Right<apiModels.GameSpecArrayV1> = {
        isRight: true,
        value: [gameSpecV1Fixture],
      };

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(getGamesV1Result)
        .mockReturnValueOnce(getGamesSpecsV1Result);

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

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetGamesV1Query> = [
        getGamesV1ArgsFixture,
        subscriptionOptionsFixture,
      ];

      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useGetGamesSpecsV1Query()', () => {
      const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';

      const expectedParams: Parameters<
        typeof cornieApi.useGetGamesSpecsV1Query
      > = [
        {
          params: [
            {
              gameId: [gameV1Fixture.id],
              sort: gameSpecSortOptionV1,
            },
          ],
        },
        {
          ...subscriptionOptionsFixture,
          skip: false,
        },
      ];

      expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should return UseGetGamesWithSpecsV1Result', () => {
      const expectedResult: UseGetGamesWithSpecsV1Result = {
        result: {
          isRight: true,
          value: [
            {
              game: gameV1Fixture,
              spec: gameSpecV1Fixture,
            },
          ],
        },
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and useGetGamesV1() returns a Right with no games and useGetGamesSpecsV1 returns Right with no game specs', () => {
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    let renderResult: RenderHookResult<UseGetGamesWithSpecsV1Result, unknown>;

    beforeAll(() => {
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

      const getGamesV1Result: Right<apiModels.GameArrayV1> = {
        isRight: true,
        value: [],
      };

      const getGamesSpecsV1Result: Right<apiModels.GameSpecArrayV1> = {
        isRight: true,
        value: [],
      };

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(getGamesV1Result)
        .mockReturnValueOnce(getGamesSpecsV1Result);

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

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetGamesV1Query> = [
        getGamesV1ArgsFixture,
        subscriptionOptionsFixture,
      ];

      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1Query).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useGetGamesSpecsV1Query()', () => {
      const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';

      const expectedParams: Parameters<
        typeof cornieApi.useGetGamesSpecsV1Query
      > = [
        {
          params: [
            {
              gameId: [],
              sort: gameSpecSortOptionV1,
            },
          ],
        },
        {
          ...subscriptionOptionsFixture,
          skip: true,
        },
      ];

      expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should return UseGetGamesWithSpecsV1Result', () => {
      const expectedResult: UseGetGamesWithSpecsV1Result = {
        result: {
          isRight: true,
          value: [],
        },
      };

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
