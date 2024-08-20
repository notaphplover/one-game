jest.mock('../../app/store/hooks');
jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { act } from 'react';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppSelector } from '../../app/store/hooks';
import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { JoinExistingGameStatus } from '../models/JoinExistingGameStatus';
import { UseJoinExistingGameResult } from '../models/UseJoinExistingGameResult';
import { useJoinExistingGame } from './useJoinExistingGame';

describe(useJoinExistingGame.name, () => {
  describe('having a window with location.href with gameId query', () => {
    let gameIdFixture: string;
    let previousLocation: Location;
    let locationFixture: URL;

    beforeAll(() => {
      gameIdFixture = 'gameId';
      previousLocation = window.location;
      locationFixture = new URL(
        `http://corniegame.com/game/joinGame?gameId=${gameIdFixture}`,
      );

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: new URL(locationFixture),
        writable: true,
      });
    });

    describe('when called, and selectAuthenticatedAuth() returns Auth and cornieApi.useGetUsersV1MeQuery() returns user data and cornieApi.useCreateGamesV1SlotsMutation() returns game slot data', () => {
      let useGetUsersV1MeQueryResultMock: jest.Mocked<
        ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
      >;
      let useCreateGamesV1SlotsMutationResultMock: jest.Mocked<
        ReturnType<typeof cornieApi.useCreateGamesV1SlotsMutation>
      >;
      let authFixture: AuthenticatedAuthState | null;
      let gameV1SlotFixture: apiModels.GameSlotV1;
      let userFixture: apiModels.UserV1;

      let renderResult: RenderHookResult<UseJoinExistingGameResult, unknown>;

      beforeAll(async () => {
        authFixture = {
          accessToken: 'accesToken-fixture',
          refreshToken: 'refreshToken-fixture',
          status: AuthStateStatus.authenticated,
        };

        gameV1SlotFixture = {
          cardsAmount: 7,
          userId: 'user-id-fixture',
        };

        userFixture = {
          active: true,
          id: 'user-id-fixture',
          name: 'user-name-fixture',
        };

        useGetUsersV1MeQueryResultMock = {
          data: userFixture,
          error: undefined,
          isLoading: false,
          refetch: jest.fn(),
        };

        useCreateGamesV1SlotsMutationResultMock = [
          jest.fn(),
          {
            reset: jest.fn(),
            status: QueryStatus.uninitialized,
          },
        ];

        const [triggerCreateGamesSlotMock] =
          useCreateGamesV1SlotsMutationResultMock;

        triggerCreateGamesSlotMock.mockImplementation(
          (): ReturnType<typeof triggerCreateGamesSlotMock> => {
            const gameSlotPayload: Awaited<
              ReturnType<typeof triggerCreateGamesSlotMock>
            > = {
              data: gameV1SlotFixture,
              error: undefined,
            };

            useCreateGamesV1SlotsMutationResultMock = [
              triggerCreateGamesSlotMock,
              {
                data: gameV1SlotFixture,
                reset: jest.fn(),
                status: QueryStatus.fulfilled,
              },
            ];

            return Promise.resolve(gameSlotPayload) as ReturnType<
              typeof triggerCreateGamesSlotMock
            >;
          },
        );

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValue({
          isRight: true,
          value: userFixture,
        });

        (
          useAppSelector as unknown as jest.Mock<typeof useAppSelector>
        ).mockReturnValue(authFixture);

        (
          cornieApi.useGetUsersV1MeQuery as jest.Mock<
            typeof cornieApi.useGetUsersV1MeQuery
          >
        ).mockReturnValue(useGetUsersV1MeQueryResultMock);

        (
          cornieApi.useCreateGamesV1SlotsMutation as jest.Mock<
            typeof cornieApi.useCreateGamesV1SlotsMutation
          >
        ).mockImplementation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (): any => useCreateGamesV1SlotsMutationResultMock,
        );

        await act(async () => {
          renderResult = renderHook(() => useJoinExistingGame());
        });

        await waitFor(() => {
          const status: JoinExistingGameStatus =
            renderResult.result.current.status;
          // eslint-disable-next-line jest/no-standalone-expect
          expect(status).toStrictEqual(JoinExistingGameStatus.fulfilled);
        });
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should call useAppSelector()', () => {
        expect(useAppSelector).toHaveBeenCalledTimes(4);
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call cornieApi.useGetUsersV1MeQuery()', () => {
        const expectedParams: Parameters<
          typeof cornieApi.useGetUsersV1MeQuery
        > = [
          {
            params: [],
          },
        ];

        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(4);
        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenNthCalledWith(
          1,
          ...expectedParams,
        );
        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenNthCalledWith(
          2,
          ...expectedParams,
        );
        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenNthCalledWith(
          3,
          ...expectedParams,
        );
        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenNthCalledWith(
          4,
          ...expectedParams,
        );
      });

      it('should call cornieApi.useCreateGamesV1SlotsMutation()', () => {
        expect(cornieApi.useCreateGamesV1SlotsMutation).toHaveBeenCalledTimes(
          4,
        );
        expect(cornieApi.useCreateGamesV1SlotsMutation).toHaveBeenCalledWith();
      });

      it('should call triggerCreateGameSlotMock()', () => {
        const [triggerCreateGamesSlotMock] =
          useCreateGamesV1SlotsMutationResultMock;

        const expectedParams: Parameters<typeof triggerCreateGamesSlotMock> = [
          {
            params: [{ gameId: gameIdFixture }, { userId: userFixture.id }],
          },
        ];

        expect(triggerCreateGamesSlotMock).toHaveBeenCalledTimes(1);
        expect(triggerCreateGamesSlotMock).toHaveBeenCalledWith(
          ...expectedParams,
        );
      });

      it('should call mapUseQueryHookResult()', () => {
        expect(mapUseQueryHookResult).toHaveBeenCalledTimes(4);
        expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
          1,
          useGetUsersV1MeQueryResultMock,
        );
        expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
          2,
          useGetUsersV1MeQueryResultMock,
        );
        expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
          3,
          useGetUsersV1MeQueryResultMock,
        );
        expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
          4,
          useGetUsersV1MeQueryResultMock,
        );
      });

      it('should have fullfilled status', () => {
        const status: JoinExistingGameStatus =
          renderResult.result.current.status;
        expect(status).toBe(JoinExistingGameStatus.fulfilled);
      });
    });

    afterAll(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: previousLocation,
        writable: true,
      });
    });
  });

  describe('having a window with location.href without gameId query', () => {
    let previousLocation: Location;
    let locationFixture: URL;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL('http://corniegame.com/game/joinGame');

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: new URL(locationFixture),
        writable: true,
      });
    });

    describe('when called', () => {
      let useGetUsersV1MeQueryResultMock: jest.Mocked<
        ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
      >;
      let useCreateGamesV1SlotsMutationResultMock: jest.Mocked<
        ReturnType<typeof cornieApi.useCreateGamesV1SlotsMutation>
      >;
      let authFixture: AuthenticatedAuthState;
      let errorMessage: string | null;
      let renderResult: RenderHookResult<UseJoinExistingGameResult, unknown>;
      let status: JoinExistingGameStatus;

      beforeAll(async () => {
        useGetUsersV1MeQueryResultMock = {
          data: undefined,
          error: undefined,
          isLoading: false,
          refetch: jest.fn(),
        };

        useCreateGamesV1SlotsMutationResultMock = [
          jest.fn(),
          {
            reset: jest.fn(),
            status: QueryStatus.uninitialized,
          },
        ];

        authFixture = {
          accessToken: 'accesToken-fixture',
          refreshToken: 'refreshToken-fixture',
          status: AuthStateStatus.authenticated,
        };

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(authFixture);
        (
          cornieApi.useGetUsersV1MeQuery as jest.Mock<
            typeof cornieApi.useGetUsersV1MeQuery
          >
        ).mockReturnValue(useGetUsersV1MeQueryResultMock);
        (
          cornieApi.useCreateGamesV1SlotsMutation as jest.Mock<
            typeof cornieApi.useCreateGamesV1SlotsMutation
          >
        ).mockReturnValue(useCreateGamesV1SlotsMutationResultMock);

        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValue({
          isRight: false,
          value: '',
        });

        await act(async () => {
          renderResult = renderHook(() => useJoinExistingGame());
        });

        status = renderResult.result.current.status;
        errorMessage = renderResult.result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should call useAppSelector()', () => {
        expect(useAppSelector).toHaveBeenCalledTimes(2);
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should return a rejected status', () => {
        expect(status).toBe(JoinExistingGameStatus.rejected);
      });

      it('should return an error message Unexpected error', () => {
        expect(errorMessage).toBe('Unexpected error');
      });
    });

    afterAll(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: previousLocation,
        writable: true,
      });
    });
  });
});
