import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../helpers/getGamesV1ErrorMessage');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../helpers/buildGameWithWinnerUserPairArrayResult');
jest.mock('./useGetWinnerUserV1ForGames');

import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesV1Args,
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
import { Either, Left, Right } from '../../common/models/Either';
import { buildGameWithWinnerUserPairArrayResult } from '../helpers/buildGameWithWinnerUserPairArrayResult';
import { getGamesV1ErrorMessage } from '../helpers/getGamesV1ErrorMessage';
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
    let getGamesV1ErrorMessageFixture: string;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let useGetWinnerUserV1ForGamesResultFixture: UseGetWinnerUserV1ForGamesResult;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
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

      getGamesV1ErrorMessageFixture = '';

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(gamesV1ResultFixture);

      (
        getGamesV1ErrorMessage as jest.Mock<typeof getGamesV1ErrorMessage>
      ).mockReturnValueOnce(getGamesV1ErrorMessageFixture);

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

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should not call getGamesV1ErrorMessage()', () => {
      expect(getGamesV1ErrorMessage).not.toHaveBeenCalled();
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

  describe('when called, and useGetGamesV1() returns a useGetGamesV1Result an error', () => {
    let gamesV1ResultFixture: Either<string, apiModels.GameArrayV1> | null;
    let gamesV1MapHookQueryResultV2Fixture: Left<
      SerializableAppError | SerializedError
    >;
    let gameWithWinnerUserV1PairArrayResultFixture: Either<
      string,
      GameWithWinnerUserPair[]
    > | null;
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let getGamesV1ErrorMessageFixture: string;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let useGetWinnerUserV1ForGamesResultFixture: UseGetWinnerUserV1ForGamesResult;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<
      UseGetGamesWithWinnerPairV1Result,
      unknown
    >;

    beforeAll(() => {
      gamesV1ResultFixture = {
        isRight: false,
        value: '',
      };

      gamesV1MapHookQueryResultV2Fixture = {
        isRight: false,
        value: {
          message: 'error-message-fixture',
        },
      };

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
        error: {
          message: 'error-message-fixture',
        },
        isLoading: true,
        refetch: jest.fn(),
      };

      getGamesV1ErrorMessageFixture =
        'An error has ocurred. Is not possible to find any games.';

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(gamesV1MapHookQueryResultV2Fixture);

      (
        getGamesV1ErrorMessage as jest.Mock<typeof getGamesV1ErrorMessage>
      ).mockReturnValueOnce(getGamesV1ErrorMessageFixture);

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

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should call getGamesV1ErrorMessage()', () => {
      expect(getGamesV1ErrorMessage).toHaveBeenCalledTimes(1);
      expect(getGamesV1ErrorMessage).toHaveBeenCalledWith(
        gamesV1MapHookQueryResultV2Fixture.value,
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

  describe('when called, and useGetGamesV1() returns games and useGetGamesWithWinnerPairV1() returns a UseGetGamesWithWinnerPairV1Result with 200 HTTP status code', () => {
    let gamesV1ResultFixture: Right<apiModels.GameArrayV1>;
    let gameWithWinnerUserV1PairArrayResultFixture: Either<
      string,
      GameWithWinnerUserPair[]
    > | null;
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let getGamesV1ErrorMessageFixture: string;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let useGetWinnerUserV1ForGamesResultFixture: UseGetWinnerUserV1ForGamesResult;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<
      UseGetGamesWithWinnerPairV1Result,
      unknown
    >;

    beforeAll(() => {
      gamesV1ResultFixture = {
        isRight: true,
        value: [
          {
            id: 'game-id-fixture',
            isPublic: false,
            name: 'name-game-fixture',
            state: {
              slots: [],
              status: 'finished',
            },
          },
        ],
      };

      gameWithWinnerUserV1PairArrayResultFixture = {
        isRight: true,
        value: [
          {
            game: {
              id: 'game-id-fixture',
              isPublic: false,
              name: 'name-game-fixture',
              state: {
                slots: [],
                status: 'finished',
              },
            },
            winnerUser: {
              active: true,
              id: 'user-id-fixture',
              name: 'name-user-fixture',
            },
          },
        ],
      };

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

      getGamesV1ErrorMessageFixture = '';

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(gamesV1ResultFixture);

      (
        getGamesV1ErrorMessage as jest.Mock<typeof getGamesV1ErrorMessage>
      ).mockReturnValueOnce(getGamesV1ErrorMessageFixture);

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

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should not call getGamesV1ErrorMessage()', () => {
      expect(getGamesV1ErrorMessage).not.toHaveBeenCalled();
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

  describe('when called, and useGetGamesV1() returns games and useGetGamesWithWinnerPairV1() returns a UseGetGamesWithWinnerPairV1Result with 400 HTTP status code', () => {
    let gamesV1ResultFixture: Either<string, apiModels.GameArrayV1> | null;
    let gameWithWinnerUserV1PairArrayResultFixture: Either<
      string,
      GameWithWinnerUserPair[]
    > | null;
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let getGamesV1ErrorMessageFixture: string;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let useGetWinnerUserV1ForGamesResultFixture: UseGetWinnerUserV1ForGamesResult;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<
      UseGetGamesWithWinnerPairV1Result,
      unknown
    >;

    beforeAll(() => {
      gamesV1ResultFixture = null;
      gameWithWinnerUserV1PairArrayResultFixture = {
        isRight: false,
        value: 'error-400-fixture',
      };
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

      getGamesV1ErrorMessageFixture = '';

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(gamesV1ResultFixture);

      (
        getGamesV1ErrorMessage as jest.Mock<typeof getGamesV1ErrorMessage>
      ).mockReturnValueOnce(getGamesV1ErrorMessageFixture);

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

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should not call getGamesV1ErrorMessage()', () => {
      expect(getGamesV1ErrorMessage).not.toHaveBeenCalled();
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

  describe('when called, and useGetGamesV1() returns games and useGetGamesWithWinnerPairV1() returns a UseGetGamesWithWinnerPairV1Result with 401 HTTP status code', () => {
    let gamesV1ResultFixture: Either<string, apiModels.GameArrayV1> | null;
    let gameWithWinnerUserV1PairArrayResultFixture: Either<
      string,
      GameWithWinnerUserPair[]
    > | null;
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let getGamesV1ErrorMessageFixture: string;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let useGetWinnerUserV1ForGamesResultFixture: UseGetWinnerUserV1ForGamesResult;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<
      UseGetGamesWithWinnerPairV1Result,
      unknown
    >;

    beforeAll(() => {
      gamesV1ResultFixture = null;
      gameWithWinnerUserV1PairArrayResultFixture = {
        isRight: false,
        value: 'error-401-fixture',
      };
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

      getGamesV1ErrorMessageFixture = '';

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(gamesV1ResultFixture);

      (
        getGamesV1ErrorMessage as jest.Mock<typeof getGamesV1ErrorMessage>
      ).mockReturnValueOnce(getGamesV1ErrorMessageFixture);

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

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should not call getGamesV1ErrorMessage()', () => {
      expect(getGamesV1ErrorMessage).not.toHaveBeenCalled();
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

  describe('when called, and useGetGamesV1() returns games and useGetGamesWithWinnerPairV1() returns a UseGetGamesWithWinnerPairV1Result with 403 HTTP status code', () => {
    let gamesV1ResultFixture: Either<string, apiModels.GameArrayV1> | null;
    let gameWithWinnerUserV1PairArrayResultFixture: Either<
      string,
      GameWithWinnerUserPair[]
    > | null;
    let getGamesV1ArgsFixture: GetGamesV1Args;
    let getGamesV1ErrorMessageFixture: string;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let useGetWinnerUserV1ForGamesResultFixture: UseGetWinnerUserV1ForGamesResult;
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.GameArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };

    let renderResult: RenderHookResult<
      UseGetGamesWithWinnerPairV1Result,
      unknown
    >;

    beforeAll(() => {
      gamesV1ResultFixture = null;
      gameWithWinnerUserV1PairArrayResultFixture = {
        isRight: false,
        value: 'error-403-fixture',
      };
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

      getGamesV1ErrorMessageFixture = '';

      (
        cornieApi.useGetGamesV1Query as jest.Mock<
          typeof cornieApi.useGetGamesV1Query
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(gamesV1ResultFixture);

      (
        getGamesV1ErrorMessage as jest.Mock<typeof getGamesV1ErrorMessage>
      ).mockReturnValueOnce(getGamesV1ErrorMessageFixture);

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

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should not call getGamesV1ErrorMessage()', () => {
      expect(getGamesV1ErrorMessage).not.toHaveBeenCalled();
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
