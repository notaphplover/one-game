import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import { GetUsersV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResult,
  UseQueryStateResult,
} from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either, Left, Right } from '../../common/models/Either';
import {
  useGetWinnerUserV1ForGames,
  UseGetWinnerUserV1ForGamesResult,
} from './useGetWinnerUserV1ForGames';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetWinnerUserV1ForGames.name, () => {
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

      let winnerUserV1ResultFixture: Either<
        string,
        apiModels.MaybeUserArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        winnerUserV1ResultFixture = null;

        (
          cornieApi.useGetUsersV1Query as jest.Mock<
            typeof cornieApi.useGetUsersV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(winnerUserV1ResultFixture);

        renderResult = renderHook(() =>
          useGetWinnerUserV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
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
              gameId: [],
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

      it('should return UseGetWinnerUserV1ForGamesResult', () => {
        const expected: UseGetWinnerUserV1ForGamesResult = {
          result: winnerUserV1ResultFixture,
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

      let winnerUserV1ResultFixture: Either<
        string,
        apiModels.MaybeUserArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        winnerUserV1ResultFixture = null;

        (
          cornieApi.useGetUsersV1Query as jest.Mock<
            typeof cornieApi.useGetUsersV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(winnerUserV1ResultFixture);

        renderResult = renderHook(() =>
          useGetWinnerUserV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
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
              gameId: [],
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

      it('should return UseGetWinnerUserV1ForGamesResult', () => {
        const expected: UseGetWinnerUserV1ForGamesResult = {
          result: winnerUserV1ResultFixture,
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

      let winnerUserV1ResultFixture: Either<
        string,
        apiModels.MaybeUserArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        winnerUserV1ResultFixture = null;

        (
          cornieApi.useGetUsersV1Query as jest.Mock<
            typeof cornieApi.useGetUsersV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(winnerUserV1ResultFixture);

        renderResult = renderHook(() =>
          useGetWinnerUserV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
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
              gameId: [],
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

      it('should return UseGetWinnerUserV1ForGamesResult', () => {
        const expected: UseGetWinnerUserV1ForGamesResult = {
          result: winnerUserV1ResultFixture,
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
          status: 'finished',
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

      let winnerUserV1ResultFixture: Either<
        string,
        apiModels.MaybeUserArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        winnerUserV1ResultFixture = null;

        (
          cornieApi.useGetUsersV1Query as jest.Mock<
            typeof cornieApi.useGetUsersV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(winnerUserV1ResultFixture);

        renderResult = renderHook(() =>
          useGetWinnerUserV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetUsersV1Query()', () => {
        const userSortOptionV1: apiModels.UserSortOptionV1 = 'ids';
        const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
          ...subscriptionOptionsFixture,
          skip: false,
        };

        const expectedGetGamesSpecsV1Args: GetUsersV1Args = {
          params: [
            {
              gameId: [gameV1Fixture.id],
              sort: userSortOptionV1,
            },
          ],
        };
        expect(cornieApi.useGetUsersV1Query).toHaveBeenCalledTimes(1);
        expect(cornieApi.useGetUsersV1Query).toHaveBeenCalledWith(
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

      it('should return UseGetWinnerUserV1ForGamesResult', () => {
        const expected: UseGetWinnerUserV1ForGamesResult = {
          result: winnerUserV1ResultFixture,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });

  describe('having Right gamesV1Result with a game and subscriptionOptions and Right winnerUser with an user', () => {
    let gameV1Fixture: apiModels.GameV1;
    let gamesV1ResultFixture: Right<apiModels.GameArrayV1>;
    let winnerUserV1Fixture: apiModels.UserV1;
    let winnerUserV1ResultFixture: Right<apiModels.MaybeUserArrayV1>;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    beforeAll(() => {
      gameV1Fixture = {
        id: 'game-id',
        isPublic: true,
        state: {
          slots: [],
          status: 'finished',
        },
      };

      gamesV1ResultFixture = {
        isRight: true,
        value: [gameV1Fixture],
      };
      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };

      winnerUserV1Fixture = {
        active: true,
        id: 'user-id-fixture',
        name: 'name-fixture',
      };
    });

    describe('when called', () => {
      let useQueryStateResultFixture: UseQueryStateResult<apiModels.GameArrayV1> & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: () => any;
      };

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useQueryStateResultFixture = {
          data: undefined,
          error: undefined,
          isLoading: true,
          refetch: jest.fn(),
        };

        winnerUserV1ResultFixture = {
          isRight: true,
          value: [winnerUserV1Fixture],
        };

        (
          cornieApi.useGetUsersV1Query as jest.Mock<
            typeof cornieApi.useGetUsersV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(winnerUserV1ResultFixture);

        renderResult = renderHook(() =>
          useGetWinnerUserV1ForGames(
            gamesV1ResultFixture,
            subscriptionOptionsFixture,
          ),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetUsersV1Query()', () => {
        const userSortOptionV1: apiModels.UserSortOptionV1 = 'ids';
        const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
          ...subscriptionOptionsFixture,
          skip: false,
        };

        const expectedGetGamesSpecsV1Args: GetUsersV1Args = {
          params: [
            {
              gameId: [gameV1Fixture.id],
              sort: userSortOptionV1,
            },
          ],
        };
        expect(cornieApi.useGetUsersV1Query).toHaveBeenCalledTimes(1);
        expect(cornieApi.useGetUsersV1Query).toHaveBeenCalledWith(
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

      it('should return UseGetWinnerUserV1ForGamesResult', () => {
        const expected: UseGetWinnerUserV1ForGamesResult = {
          result: winnerUserV1ResultFixture,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });
});
