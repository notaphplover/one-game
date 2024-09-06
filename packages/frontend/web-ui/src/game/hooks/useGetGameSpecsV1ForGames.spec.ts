import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import { GetGamesSpecsV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResult,
  UseQueryStateResult,
} from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either, Left, Right } from '../../common/models/Either';
import {
  useGetGameSpecsV1ForGames,
  UseGetGameSpecsV1ForGamesResult,
} from './useGetGameSpecsV1ForGames';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetGameSpecsV1ForGames.name, () => {
  describe('having gamesV1Result null and subscriptionOptions', () => {
    let gamesV1ResultFixture: null;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    beforeAll(() => {
      gamesV1ResultFixture = null;
      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };
    });

    describe('when called', () => {
      let useQueryStateResultFixture: UseQueryStateResult<apiModels.GameArrayV1> & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: () => any;
      };

      let gameSpecsV1ResultFixture: Either<
        string,
        apiModels.GameSpecArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetGameSpecsV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        gameSpecsV1ResultFixture = null;

        (
          cornieApi.useGetGamesSpecsV1Query as jest.Mock<
            typeof cornieApi.useGetGamesSpecsV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(gameSpecsV1ResultFixture);

        renderResult = renderHook(() =>
          useGetGameSpecsV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetGamesSpecsV1Query()', () => {
        const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';
        const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
          ...subscriptionOptionsFixture,
          skip: true,
        };

        const expectedGetGamesSpecsV1Args: GetGamesSpecsV1Args = {
          params: [
            {
              gameId: [],
              sort: gameSpecSortOptionV1,
            },
          ],
        };
        expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledTimes(1);
        expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledWith(
          expectedGetGamesSpecsV1Args,
          expectedSubscriptionOptions,
        );
      });

      it('should call mapUseQueryHookResult()', () => {
        expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
        expect(mapUseQueryHookResult).toHaveBeenCalledWith(
          useQueryStateResultFixture,
        );
      });

      it('should return UseGetGameSpecsV1ForGamesResult', () => {
        const expected: UseGetGameSpecsV1ForGamesResult = {
          result: gameSpecsV1ResultFixture,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });

  describe('having Left gamesV1Result and subscriptionOptions', () => {
    let gamesV1ResultFixture: Left<string>;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    beforeAll(() => {
      gamesV1ResultFixture = {
        isRight: false,
        value: 'value-fixture',
      };
      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };
    });

    describe('when called', () => {
      let useQueryStateResultFixture: UseQueryStateResult<apiModels.GameArrayV1> & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: () => any;
      };

      let gameSpecsV1ResultFixture: Either<
        string,
        apiModels.GameSpecArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetGameSpecsV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        gameSpecsV1ResultFixture = null;

        (
          cornieApi.useGetGamesSpecsV1Query as jest.Mock<
            typeof cornieApi.useGetGamesSpecsV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(gameSpecsV1ResultFixture);

        renderResult = renderHook(() =>
          useGetGameSpecsV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetGamesSpecsV1Query()', () => {
        const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';
        const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
          ...subscriptionOptionsFixture,
          skip: true,
        };

        const expectedGetGamesSpecsV1Args: GetGamesSpecsV1Args = {
          params: [
            {
              gameId: [],
              sort: gameSpecSortOptionV1,
            },
          ],
        };
        expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledTimes(1);
        expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledWith(
          expectedGetGamesSpecsV1Args,
          expectedSubscriptionOptions,
        );
      });

      it('should call mapUseQueryHookResult()', () => {
        expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
        expect(mapUseQueryHookResult).toHaveBeenCalledWith(
          useQueryStateResultFixture,
        );
      });

      it('should return UseGetGameSpecsV1ForGamesResult', () => {
        const expected: UseGetGameSpecsV1ForGamesResult = {
          result: gameSpecsV1ResultFixture,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });

  describe('having Right gamesV1Result with no games and subscriptionOptions', () => {
    let gamesV1ResultFixture: Right<apiModels.GameArrayV1>;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    beforeAll(() => {
      gamesV1ResultFixture = {
        isRight: true,
        value: [],
      };
      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };
    });

    describe('when called', () => {
      let useQueryStateResultFixture: UseQueryStateResult<apiModels.GameArrayV1> & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: () => any;
      };

      let gameSpecsV1ResultFixture: Either<
        string,
        apiModels.GameSpecArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetGameSpecsV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        gameSpecsV1ResultFixture = null;

        (
          cornieApi.useGetGamesSpecsV1Query as jest.Mock<
            typeof cornieApi.useGetGamesSpecsV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(gameSpecsV1ResultFixture);

        renderResult = renderHook(() =>
          useGetGameSpecsV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetGamesSpecsV1Query()', () => {
        const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';
        const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
          ...subscriptionOptionsFixture,
          skip: true,
        };

        const expectedGetGamesSpecsV1Args: GetGamesSpecsV1Args = {
          params: [
            {
              gameId: [],
              sort: gameSpecSortOptionV1,
            },
          ],
        };
        expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledTimes(1);
        expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledWith(
          expectedGetGamesSpecsV1Args,
          expectedSubscriptionOptions,
        );
      });

      it('should call mapUseQueryHookResult()', () => {
        expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
        expect(mapUseQueryHookResult).toHaveBeenCalledWith(
          useQueryStateResultFixture,
        );
      });

      it('should return UseGetGameSpecsV1ForGamesResult', () => {
        const expected: UseGetGameSpecsV1ForGamesResult = {
          result: gameSpecsV1ResultFixture,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });

  describe('having Right gamesV1Result with a game and subscriptionOptions', () => {
    let gameV1Fixture: apiModels.GameV1;
    let gamesV1ResultFixture: Right<apiModels.GameArrayV1>;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    beforeAll(() => {
      gameV1Fixture = {
        id: 'game-id',
        isPublic: true,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      };

      gamesV1ResultFixture = {
        isRight: true,
        value: [gameV1Fixture],
      };
      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };
    });

    describe('when called', () => {
      let useQueryStateResultFixture: UseQueryStateResult<apiModels.GameArrayV1> & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: () => any;
      };

      let gameSpecsV1ResultFixture: Either<
        string,
        apiModels.GameSpecArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetGameSpecsV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        gameSpecsV1ResultFixture = null;

        (
          cornieApi.useGetGamesSpecsV1Query as jest.Mock<
            typeof cornieApi.useGetGamesSpecsV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(gameSpecsV1ResultFixture);

        renderResult = renderHook(() =>
          useGetGameSpecsV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetGamesSpecsV1Query()', () => {
        const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';
        const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
          ...subscriptionOptionsFixture,
          skip: false,
        };

        const expectedGetGamesSpecsV1Args: GetGamesSpecsV1Args = {
          params: [
            {
              gameId: [gameV1Fixture.id],
              sort: gameSpecSortOptionV1,
            },
          ],
        };
        expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledTimes(1);
        expect(cornieApi.useGetGamesSpecsV1Query).toHaveBeenCalledWith(
          expectedGetGamesSpecsV1Args,
          expectedSubscriptionOptions,
        );
      });

      it('should call mapUseQueryHookResult()', () => {
        expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
        expect(mapUseQueryHookResult).toHaveBeenCalledWith(
          useQueryStateResultFixture,
        );
      });

      it('should return UseGetGameSpecsV1ForGamesResult', () => {
        const expected: UseGetGameSpecsV1ForGamesResult = {
          result: gameSpecsV1ResultFixture,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });
});
