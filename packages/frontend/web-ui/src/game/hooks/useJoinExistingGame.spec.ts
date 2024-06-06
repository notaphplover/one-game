jest.mock('./useJoinGame');
jest.mock('../../app/store/hooks');
jest.mock('../../app/store/thunk/getUserMe');
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: jest.fn(),
}));

import { describe, expect, jest, it, beforeAll, afterAll } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { PayloadAction } from '@reduxjs/toolkit';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { FulfilledUserState } from '../../app/store/helpers/models/UserState';
import { UserStateStatus } from '../../app/store/helpers/models/UserStateStatus';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { getUserMe } from '../../app/store/thunk/getUserMe';
import { SingleApiCallResult } from '../../common/hooks/useSingleApiCall';
import { UserMeSerializedResponse } from '../../common/http/models/UserMeSerializedResponse';
import { JoinExistingGameStatus } from '../models/JoinExistingGameStatus';
import { UseJoinExistingGameResult } from '../models/UseJoinExistingGameResult';
import {
  UNEXPECTED_ERROR_MESSAGE,
  useJoinExistingGame,
} from './useJoinExistingGame';
import { useJoinGame } from './useJoinGame';
import { UseJoinGameParams } from './useJoinGame/models/UseJoinGameParams';
import { UNAUTHORIZED_ERROR_MESSAGE } from './useJoinGame/utils/unexpectedErrorMessage';

describe(useJoinExistingGame.name, () => {
  let callJoinGameMock: jest.Mock<(params: UseJoinGameParams) => void>;
  let singleApiCallHookResultFixture: SingleApiCallResult<
    UseJoinGameParams,
    apiModels.NonStartedGameSlotV1
  >;

  let dispatchMock: ReturnType<typeof useAppDispatch> &
    jest.Mock<ReturnType<typeof useAppDispatch>>;

  let navigateMock: ReturnType<typeof useNavigate> &
    jest.Mock<ReturnType<typeof useNavigate>>;

  beforeAll(() => {
    callJoinGameMock = jest.fn();
  });

  describe('having a window with location.href with gameId query', () => {
    let previousLocation: Location;
    let locationFixture: URL;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL(
        'http://corniegame.com/game/joinGame?gameId=gameId',
      );

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: new URL(locationFixture),
        writable: true,
      });
    });

    describe('when called, and auth is null and use navigate to go to Login page', () => {
      let getUserMeResult: ReturnType<typeof getUserMe>;
      let authFixture: AuthenticatedAuthState | null;
      let userFixture: FulfilledUserState;

      beforeAll(async () => {
        authFixture = null;

        userFixture = {
          status: UserStateStatus.fulfilled,
          userId: 'userId-fixture',
        };

        singleApiCallHookResultFixture = {
          call: callJoinGameMock,
          result: null,
        };

        getUserMeResult = Symbol() as unknown as ReturnType<typeof getUserMe>;

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture);

        (useJoinGame as jest.Mock<typeof useJoinGame>)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture);

        (
          getUserMe as unknown as jest.Mock<typeof getUserMe>
        ).mockReturnValueOnce(getUserMeResult);

        navigateMock = jest
          .fn<ReturnType<typeof useNavigate>>()
          .mockReturnValue(undefined) as ReturnType<typeof useNavigate> &
          jest.Mock<ReturnType<typeof useNavigate>>;

        (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
          navigateMock,
        );

        (
          useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
        ).mockReturnValue(dispatchMock);

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await act(() => {
          renderHook(() => useJoinExistingGame());
        });
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should call useAppSelector() six times', () => {
        expect(useAppSelector).toHaveBeenCalledTimes(6);
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call useJoinGame() three times', () => {
        expect(useJoinGame).toHaveBeenCalledTimes(3);
        expect(useJoinGame).toHaveBeenNthCalledWith(1);
        expect(useJoinGame).toHaveBeenNthCalledWith(2);
        expect(useJoinGame).toHaveBeenNthCalledWith(3);
      });

      it('should call navigate() to the Login page', () => {
        const redirectToUrl: string = `/auth/login?redirectTo=http://corniegame.com/game/joinGame?gameId=gameId`;
        expect(navigateMock).toHaveBeenCalledWith(redirectToUrl);
      });
    });

    describe('when called, and user is null and call getUserMe() returns a OK response', () => {
      let getUserMeResult: ReturnType<typeof getUserMe>;
      let authFixture: AuthenticatedAuthState;
      let userFixture: FulfilledUserState | null;
      let result: RenderHookResult<UseJoinExistingGameResult, unknown>;

      beforeAll(async () => {
        authFixture = {
          accessToken: 'accesToken-fixture',
          refreshToken: 'refreshToken-fixture',
          status: AuthStateStatus.authenticated,
        };

        userFixture = null;

        singleApiCallHookResultFixture = {
          call: callJoinGameMock,
          result: null,
        };

        getUserMeResult = Symbol() as unknown as ReturnType<typeof getUserMe>;

        const payloadActionFixture: PayloadAction<UserMeSerializedResponse> = {
          payload: {
            body: {
              active: true,
              id: 'id-fixture',
              name: 'name-fixture',
            },
            statusCode: 200,
          },
          type: 'sample-type',
        };

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture);

        (useJoinGame as jest.Mock<typeof useJoinGame>)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture);

        (
          getUserMe as unknown as jest.Mock<typeof getUserMe>
        ).mockReturnValueOnce(getUserMeResult);

        (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
          navigateMock,
        );

        dispatchMock = jest
          .fn<ReturnType<typeof useAppDispatch>>()
          .mockImplementationOnce(
            <TReturn, TAction>(): TAction | TReturn =>
              payloadActionFixture as TReturn,
          ) as ReturnType<typeof useAppDispatch> &
          jest.Mock<ReturnType<typeof useAppDispatch>>;

        (
          useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
        ).mockReturnValue(dispatchMock);

        result = renderHook(() => useJoinExistingGame());

        await waitFor(() => {
          const status: JoinExistingGameStatus = result.result.current.status;
          // eslint-disable-next-line jest/no-standalone-expect
          expect(status).toStrictEqual(JoinExistingGameStatus.pendingBackend);
        });
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should call useAppDispatch()', () => {
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(getUserMeResult);
      });

      it('should call useAppSelector() six times', () => {
        expect(useAppSelector).toHaveBeenCalledTimes(6);
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call useJoinGame() three times', () => {
        expect(useJoinGame).toHaveBeenCalledTimes(3);
        expect(useJoinGame).toHaveBeenNthCalledWith(1);
        expect(useJoinGame).toHaveBeenNthCalledWith(2);
        expect(useJoinGame).toHaveBeenNthCalledWith(3);
      });
    });

    describe('when called, and auth is not null and user is not null and call useJoinGame() returns an OK response', () => {
      let getUserMeResult: ReturnType<typeof getUserMe>;
      let errorMessage: string | null;
      let renderResult: RenderHookResult<UseJoinExistingGameResult, unknown>;
      let status: JoinExistingGameStatus;
      let authFixture: AuthenticatedAuthState;
      let userFixture: FulfilledUserState;

      beforeAll(async () => {
        authFixture = {
          accessToken: 'accesToken-fixture',
          refreshToken: 'refreshToken-fixture',
          status: AuthStateStatus.authenticated,
        };

        userFixture = {
          status: UserStateStatus.fulfilled,
          userId: 'userId-fixture',
        };

        singleApiCallHookResultFixture = {
          call: callJoinGameMock,
          result: {
            isRight: true,
            value: {
              userId: 'userId-fixture',
            },
          },
        };

        getUserMeResult = Symbol() as unknown as ReturnType<typeof getUserMe>;

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture);

        (useJoinGame as jest.Mock<typeof useJoinGame>)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture);

        (
          getUserMe as unknown as jest.Mock<typeof getUserMe>
        ).mockReturnValueOnce(getUserMeResult);

        (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
          navigateMock,
        );

        (
          useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
        ).mockReturnValue(dispatchMock);

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture);

        (useJoinGame as jest.Mock<typeof useJoinGame>).mockReturnValueOnce(
          singleApiCallHookResultFixture,
        );

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture);

        (useJoinGame as jest.Mock<typeof useJoinGame>).mockReturnValueOnce(
          singleApiCallHookResultFixture,
        );

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture);

        (useJoinGame as jest.Mock<typeof useJoinGame>).mockReturnValueOnce(
          singleApiCallHookResultFixture,
        );

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await act(() => {
          renderResult = renderHook(() => useJoinExistingGame());
        });

        status = renderResult.result.current.status;
        errorMessage = renderResult.result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should call useAppSelector() eight times', () => {
        expect(useAppSelector).toHaveBeenCalledTimes(8);
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call useJoinGame() four times', () => {
        expect(useJoinGame).toHaveBeenCalledTimes(4);
        expect(useJoinGame).toHaveBeenNthCalledWith(1);
        expect(useJoinGame).toHaveBeenNthCalledWith(2);
        expect(useJoinGame).toHaveBeenNthCalledWith(3);
        expect(useJoinGame).toHaveBeenNthCalledWith(4);
      });

      it('should return a fulfilled status', () => {
        expect(status).toBe(JoinExistingGameStatus.fulfilled);
      });

      it('should return a null error message', () => {
        expect(errorMessage).toBeNull();
      });
    });

    describe('when called, and auth is not null and user is not null and call useJoinGame() returns an non OK response', () => {
      let getUserMeResult: ReturnType<typeof getUserMe>;
      let errorMessage: string | null;
      let renderResult: RenderHookResult<UseJoinExistingGameResult, unknown>;
      let status: JoinExistingGameStatus;
      let authFixture: AuthenticatedAuthState;
      let userFixture: FulfilledUserState;

      beforeAll(async () => {
        authFixture = {
          accessToken: 'accesToken-fixture',
          refreshToken: 'refreshToken-fixture',
          status: AuthStateStatus.authenticated,
        };

        userFixture = {
          status: UserStateStatus.fulfilled,
          userId: 'userId-fixture',
        };

        singleApiCallHookResultFixture = {
          call: callJoinGameMock,
          result: {
            isRight: false,
            value: UNAUTHORIZED_ERROR_MESSAGE,
          },
        };

        getUserMeResult = Symbol() as unknown as ReturnType<typeof getUserMe>;

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture);

        (useJoinGame as jest.Mock<typeof useJoinGame>)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture);

        (
          getUserMe as unknown as jest.Mock<typeof getUserMe>
        ).mockReturnValueOnce(getUserMeResult);

        (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
          navigateMock,
        );

        (
          useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
        ).mockReturnValue(dispatchMock);

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await act(() => {
          renderResult = renderHook(() => useJoinExistingGame());
        });

        status = renderResult.result.current.status;
        errorMessage = renderResult.result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should call useAppSelector() eight times', () => {
        expect(useAppSelector).toHaveBeenCalledTimes(8);
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call useJoinGame() four times', () => {
        expect(useJoinGame).toHaveBeenCalledTimes(4);
        expect(useJoinGame).toHaveBeenNthCalledWith(1);
        expect(useJoinGame).toHaveBeenNthCalledWith(2);
        expect(useJoinGame).toHaveBeenNthCalledWith(3);
        expect(useJoinGame).toHaveBeenNthCalledWith(4);
      });

      it('should return a rejected status', () => {
        expect(status).toBe(JoinExistingGameStatus.rejected);
      });

      it('should return an error message', () => {
        expect(errorMessage).toStrictEqual(UNAUTHORIZED_ERROR_MESSAGE);
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

    describe('when called, and the error grid is showed', () => {
      let getUserMeResult: ReturnType<typeof getUserMe>;
      let errorMessage: string | null;
      let renderResult: RenderHookResult<UseJoinExistingGameResult, unknown>;
      let status: JoinExistingGameStatus;
      let authFixture: AuthenticatedAuthState;
      let userFixture: FulfilledUserState;

      beforeAll(async () => {
        authFixture = {
          accessToken: 'accesToken-fixture',
          refreshToken: 'refreshToken-fixture',
          status: AuthStateStatus.authenticated,
        };

        userFixture = {
          status: UserStateStatus.fulfilled,
          userId: 'userId-fixture',
        };

        singleApiCallHookResultFixture = {
          call: callJoinGameMock,
          result: {
            isRight: false,
            value: UNAUTHORIZED_ERROR_MESSAGE,
          },
        };

        getUserMeResult = Symbol() as unknown as ReturnType<typeof getUserMe>;

        (useAppSelector as unknown as jest.Mock<typeof useAppSelector>)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture)
          .mockReturnValueOnce(authFixture)
          .mockReturnValueOnce(userFixture);

        (useJoinGame as jest.Mock<typeof useJoinGame>)
          .mockReturnValueOnce(singleApiCallHookResultFixture)
          .mockReturnValueOnce(singleApiCallHookResultFixture);

        (
          getUserMe as unknown as jest.Mock<typeof getUserMe>
        ).mockReturnValueOnce(getUserMeResult);

        (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
          navigateMock,
        );

        (
          useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
        ).mockReturnValue(dispatchMock);

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await act(() => {
          renderResult = renderHook(() => useJoinExistingGame());
        });

        status = renderResult.result.current.status;
        errorMessage = renderResult.result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should call useAppSelector() four times', () => {
        expect(useAppSelector).toHaveBeenCalledTimes(4);
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call useJoinGame() twice', () => {
        expect(useJoinGame).toHaveBeenCalledTimes(2);
        expect(useJoinGame).toHaveBeenNthCalledWith(1);
        expect(useJoinGame).toHaveBeenNthCalledWith(2);
      });

      it('should return a rejected status', () => {
        expect(status).toBe(JoinExistingGameStatus.rejected);
      });

      it('should return an error message Unexpected error', () => {
        expect(errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
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
