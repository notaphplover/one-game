import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./useGetUsersV1');
jest.mock('../helpers/getWinnerUserId');

import { models as apiModels } from '@cornie-js/api-models';
import {
  GetUsersV1Args,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import { Either, Left, Right } from '../../common/models/Either';
import { getWinnerUserId } from '../helpers/getWinnerUserId';
import { useGetUsersV1, UseGetUsersV1Result } from './useGetUsersV1';
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
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    let userIdFixture: string;

    beforeAll(() => {
      gamesV1ResultFixture = null;

      getUsersV1ArgsFixture = {
        params: [
          {
            id: [],
            sort: 'ids',
          },
        ],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
        skip: true,
      };

      userIdFixture = '';
    });

    describe('when called', () => {
      let winnerUserV1ResultFixture: Either<
        SerializableAppError | SerializedError,
        apiModels.MaybeUserArrayV1
      > | null;

      let useGetUsersV1ResultFixture: UseGetUsersV1Result;

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        winnerUserV1ResultFixture = null;
        useGetUsersV1ResultFixture = { result: null };

        (getWinnerUserId as jest.Mock<typeof getWinnerUserId>).mockReturnValue(
          userIdFixture,
        );

        (useGetUsersV1 as jest.Mock<typeof useGetUsersV1>).mockReturnValue(
          useGetUsersV1ResultFixture,
        );

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

      it('should not call getWinnerUserId()', () => {
        expect(getWinnerUserId).not.toHaveBeenCalled();
      });

      it('should call useGetUsersV1()', () => {
        expect(useGetUsersV1).toHaveBeenCalledTimes(1);
        expect(useGetUsersV1).toHaveBeenCalledWith(
          getUsersV1ArgsFixture,
          subscriptionOptionsFixture,
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
    let gamesV1ResultFixture: Left<SerializableAppError | SerializedError>;
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let userIdFixture: string;

    beforeAll(() => {
      gamesV1ResultFixture = {
        isRight: false,
        value: {
          message: 'value-fixture',
        },
      };

      getUsersV1ArgsFixture = {
        params: [
          {
            id: [],
            sort: 'ids',
          },
        ],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
        skip: true,
      };

      userIdFixture = '';
    });

    describe('when called', () => {
      let winnerUserV1ResultFixture: Either<
        SerializableAppError | SerializedError,
        apiModels.MaybeUserArrayV1
      > | null;

      let useGetUsersV1ResultFixture: UseGetUsersV1Result;

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        winnerUserV1ResultFixture = null;
        useGetUsersV1ResultFixture = { result: null };

        (getWinnerUserId as jest.Mock<typeof getWinnerUserId>).mockReturnValue(
          userIdFixture,
        );

        (useGetUsersV1 as jest.Mock<typeof useGetUsersV1>).mockReturnValue(
          useGetUsersV1ResultFixture,
        );

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

      it('should not call getWinnerUserId()', () => {
        expect(getWinnerUserId).not.toHaveBeenCalled();
      });

      it('should call useGetUsersV1()', () => {
        expect(useGetUsersV1).toHaveBeenCalledTimes(1);
        expect(useGetUsersV1).toHaveBeenCalledWith(
          getUsersV1ArgsFixture,
          subscriptionOptionsFixture,
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
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let userIdFixture: string;

    beforeAll(() => {
      gamesV1ResultFixture = {
        isRight: true,
        value: [],
      };

      getUsersV1ArgsFixture = {
        params: [
          {
            id: [],
            sort: 'ids',
          },
        ],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
        skip: true,
      };

      userIdFixture = '';
    });

    describe('when called', () => {
      let winnerUserV1ResultFixture: Either<
        SerializableAppError | SerializedError,
        apiModels.MaybeUserArrayV1
      > | null;

      let useGetUsersV1ResultFixture: UseGetUsersV1Result;

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        winnerUserV1ResultFixture = null;
        useGetUsersV1ResultFixture = { result: null };

        (getWinnerUserId as jest.Mock<typeof getWinnerUserId>).mockReturnValue(
          userIdFixture,
        );

        (useGetUsersV1 as jest.Mock<typeof useGetUsersV1>).mockReturnValue(
          useGetUsersV1ResultFixture,
        );

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

      it('should not call getWinnerUserId()', () => {
        expect(getWinnerUserId).not.toHaveBeenCalled();
      });

      it('should call useGetUsersV1()', () => {
        expect(useGetUsersV1).toHaveBeenCalledTimes(1);
        expect(useGetUsersV1).toHaveBeenCalledWith(
          getUsersV1ArgsFixture,
          subscriptionOptionsFixture,
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

  describe('having Right gamesV1Result with a game and subscriptionOptions and Left useGetUsersV1Result', () => {
    let gameV1Fixture: apiModels.GameV1;
    let gamesV1ResultFixture: Right<apiModels.GameArrayV1>;
    let useGetUsersV1ResultFixture: Left<
      SerializableAppError | SerializedError
    >;
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let userIdFixture: string;

    beforeAll(() => {
      gameV1Fixture = {
        id: 'game-id',
        isPublic: true,
        state: {
          slots: [
            { cardsAmount: 0, userId: 'user-id-1-fixture' },
            { cardsAmount: 34, userId: 'user-id-2-fixture' },
          ],
          status: 'finished',
        },
      };

      gamesV1ResultFixture = {
        isRight: true,
        value: [gameV1Fixture],
      };

      getUsersV1ArgsFixture = {
        params: [
          {
            id: ['user-id-1-fixture'],
            sort: 'ids',
          },
        ],
      };

      userIdFixture = 'user-id-1-fixture';

      useGetUsersV1ResultFixture = {
        isRight: false,
        value: {
          message: 'error-fixture',
        },
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
        skip: false,
      };
    });

    describe('when called', () => {
      let winnerUserV1ResultFixture: Either<
        SerializableAppError | SerializedError,
        apiModels.MaybeUserArrayV1
      > | null;

      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        winnerUserV1ResultFixture = {
          isRight: false,
          value: {
            message: 'error-fixture',
          },
        };

        (getWinnerUserId as jest.Mock<typeof getWinnerUserId>).mockReturnValue(
          userIdFixture,
        );

        (useGetUsersV1 as jest.Mock<typeof useGetUsersV1>).mockReturnValue({
          result: useGetUsersV1ResultFixture,
        });

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

      it('should call getWinnerUserId()', () => {
        expect(getWinnerUserId).toHaveBeenCalledTimes(1);
        expect(getWinnerUserId).toHaveBeenCalledWith(gameV1Fixture);
      });

      it('should call useGetUsersV1()', () => {
        expect(useGetUsersV1).toHaveBeenCalledTimes(1);
        expect(useGetUsersV1).toHaveBeenCalledWith(
          getUsersV1ArgsFixture,
          subscriptionOptionsFixture,
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

  describe('having Right gamesV1Result with a game and subscriptionOptions and Right useGetUsersV1Result', () => {
    let gameV1Fixture: apiModels.GameV1;
    let gamesV1ResultFixture: Right<apiModels.GameArrayV1>;
    let userV1Fixture: apiModels.UserV1;
    let useGetUsersV1ResultFixture: Right<apiModels.MaybeUserArrayV1>;
    let getUsersV1ArgsFixture: GetUsersV1Args;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;
    let userIdFixture: string;

    beforeAll(() => {
      gameV1Fixture = {
        id: 'game-id',
        isPublic: true,
        state: {
          slots: [
            { cardsAmount: 0, userId: 'user-id-1-fixture' },
            { cardsAmount: 34, userId: 'user-id-2-fixture' },
          ],
          status: 'finished',
        },
      };

      gamesV1ResultFixture = {
        isRight: true,
        value: [gameV1Fixture],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
        skip: false,
      };

      userIdFixture = 'user-id-1-fixture';

      userV1Fixture = {
        active: true,
        id: 'user-id-fixture',
        name: 'name-fixture',
      };

      getUsersV1ArgsFixture = {
        params: [
          {
            id: ['user-id-1-fixture'],
            sort: 'ids',
          },
        ],
      };
    });

    describe('when called', () => {
      let renderResult: RenderHookResult<
        UseGetWinnerUserV1ForGamesResult,
        unknown
      >;

      beforeAll(() => {
        useGetUsersV1ResultFixture = {
          isRight: true,
          value: [userV1Fixture],
        };

        (getWinnerUserId as jest.Mock<typeof getWinnerUserId>).mockReturnValue(
          userIdFixture,
        );

        (useGetUsersV1 as jest.Mock<typeof useGetUsersV1>).mockReturnValue({
          result: useGetUsersV1ResultFixture,
        });

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

      it('should call getWinnerUserId()', () => {
        expect(getWinnerUserId).toHaveBeenCalledTimes(1);
        expect(getWinnerUserId).toHaveBeenCalledWith(gameV1Fixture);
      });

      it('should call useGetUsersV1()', () => {
        expect(useGetUsersV1).toHaveBeenCalledTimes(1);
        expect(useGetUsersV1).toHaveBeenCalledWith(
          getUsersV1ArgsFixture,
          subscriptionOptionsFixture,
        );
      });

      it('should return UseGetWinnerUserV1ForGamesResult', () => {
        const expected: UseGetWinnerUserV1ForGamesResult = {
          result: useGetUsersV1ResultFixture,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });
});
