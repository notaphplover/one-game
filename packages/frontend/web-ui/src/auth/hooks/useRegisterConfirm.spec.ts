import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/http/services/HttpService');
jest.mock('../../common/http/helpers/buildSerializableResponse');
jest.mock('../../app/store/thunk/createAuthByToken');
jest.mock('../../app/store/hooks');

import { RenderHookResult, act, renderHook } from '@testing-library/react';
import {
  UNAUTHORIZED_ERROR_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
  useRegisterConfirm,
} from './useRegisterConfirm';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { RegisterConfirmStatus } from '../models/RegisterConfirmStatus';
import { UseRegisterConfirmResult } from '../models/UseRegisterConfirmResult';
import { RegisterConfirmResponse } from '../../common/http/models/RegisterConfirmResponse';
import { RegisterConfirmSerializedResponse } from '../../common/http/models/RegisterConfirmSerializedResponse';
import { createAuthByToken } from '../../app/store/thunk/createAuthByToken';
import { PayloadAction } from '@reduxjs/toolkit';
import { AuthSerializedResponse } from '../../common/http/models/AuthSerializedResponse';

describe(useRegisterConfirm.name, () => {
  let dispatchMock: ReturnType<typeof useAppDispatch> &
    jest.Mock<ReturnType<typeof useAppDispatch>>;
  let tokenFixture: string | null;

  beforeAll(() => {
    tokenFixture = null;
  });

  describe('having a window with location.href with code query', () => {
    let previousLocation: Location;
    let locationFixture: URL;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL('http://corniegame.com/auth/path?code=code');

      Object.defineProperty(window, 'location', {
        value: new URL(locationFixture),
        configurable: true,
      });
    });

    describe('when called, and httpClient.endpoints.updateUserMe() returns an OK response', () => {
      let createAuthByTokenResult: ReturnType<typeof createAuthByToken>;
      let registerConfirmResponseFixture: RegisterConfirmResponse;
      let serializableResponseFixture: RegisterConfirmSerializedResponse;
      let status: RegisterConfirmStatus;
      let errorMessage: string | null;
      let renderResult: RenderHookResult<UseRegisterConfirmResult, unknown>;

      beforeAll(async () => {
        createAuthByTokenResult = Symbol() as unknown as ReturnType<
          typeof createAuthByToken
        >;

        tokenFixture = 'jwt token fixture';

        registerConfirmResponseFixture = {
          headers: {},
          body: {
            active: true,
            id: 'id',
            name: 'name',
          },
          statusCode: 200,
        };

        serializableResponseFixture = {
          body: {
            active: true,
            id: 'id',
            name: 'name',
          },
          statusCode: 200,
        };

        const payloadActionFixture: PayloadAction<AuthSerializedResponse> = {
          payload: {
            body: {
              jwt: 'jwt-fixture',
            },
            statusCode: 200,
          },
          type: 'sample-type',
        };

        (
          useAppSelector as unknown as jest.Mock<typeof useAppSelector>
        ).mockReturnValueOnce(tokenFixture);

        (
          httpClient.endpoints.updateUserMe as jest.Mock<
            typeof httpClient.endpoints.updateUserMe
          >
        ).mockResolvedValueOnce(registerConfirmResponseFixture);

        (
          buildSerializableResponse as jest.Mock<
            typeof buildSerializableResponse
          >
        ).mockReturnValueOnce(serializableResponseFixture);

        (
          createAuthByToken as unknown as jest.Mock<typeof createAuthByToken>
        ).mockReturnValueOnce(createAuthByTokenResult);

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

        await act(() => {
          renderResult = renderHook(() => useRegisterConfirm());
        });

        status = renderResult.result.current.status;
        errorMessage = renderResult.result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should called useAppDispatch()', () => {
        expect(dispatchMock).toHaveBeenCalled();
        expect(dispatchMock).toHaveBeenCalledWith(createAuthByTokenResult);
      });

      it('should called useAppSelector() ', () => {
        expect(useAppSelector).toHaveBeenCalled();
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should called httpClient.endpoints.updateUserMe()', () => {
        expect(httpClient.endpoints.updateUserMe).toHaveBeenCalled();
        expect(httpClient.endpoints.updateUserMe).toHaveBeenCalledWith(
          {
            authorization: `Bearer undefined`,
          },
          {
            active: true,
          },
        );
      });

      it('should return a fulfilled status', () => {
        expect(status).toBe(RegisterConfirmStatus.fulfilled);
      });

      it('should return a null error message', () => {
        expect(errorMessage).toBeNull();
      });
    });

    describe('when called, and httpClient.endpoints.updateUserMe() returns a non OK response', () => {
      let createAuthByTokenResult: ReturnType<typeof createAuthByToken>;
      let registerConfirmResponseFixture: RegisterConfirmResponse;
      let serializableResponseFixture: RegisterConfirmSerializedResponse;
      let status: RegisterConfirmStatus;
      let errorMessage: string | null;
      let renderResult: RenderHookResult<UseRegisterConfirmResult, unknown>;

      beforeAll(async () => {
        createAuthByTokenResult = Symbol() as unknown as ReturnType<
          typeof createAuthByToken
        >;

        tokenFixture = 'jwt token fixture';

        registerConfirmResponseFixture = {
          headers: {},
          body: {
            description: 'Error Fixture',
          },
          statusCode: 401,
        };

        serializableResponseFixture = {
          body: {
            description: 'Error Fixture',
          },
          statusCode: 401,
        };

        const payloadActionFixture: PayloadAction<AuthSerializedResponse> = {
          payload: {
            body: {
              description: 'Error Fixture',
            },
            statusCode: 401,
          },
          type: 'sample-type',
        };

        (
          useAppSelector as unknown as jest.Mock<typeof useAppSelector>
        ).mockReturnValueOnce(tokenFixture);

        (
          httpClient.endpoints.updateUserMe as jest.Mock<
            typeof httpClient.endpoints.updateUserMe
          >
        ).mockResolvedValueOnce(registerConfirmResponseFixture);

        (
          buildSerializableResponse as jest.Mock<
            typeof buildSerializableResponse
          >
        ).mockReturnValueOnce(serializableResponseFixture);

        (
          createAuthByToken as unknown as jest.Mock<typeof createAuthByToken>
        ).mockReturnValueOnce(createAuthByTokenResult);

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

        await act(() => {
          renderResult = renderHook(() => useRegisterConfirm());
        });

        status = renderResult.result.current.status;
        errorMessage = renderResult.result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should called useAppDispatch()', () => {
        expect(dispatchMock).toHaveBeenCalled();
        expect(dispatchMock).toHaveBeenCalledWith(createAuthByTokenResult);
      });

      it('should called useAppSelector() ', () => {
        expect(useAppSelector).toHaveBeenCalled();
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should called httpClient.endpoints.updateUserMe()', () => {
        expect(httpClient.endpoints.updateUserMe).toHaveBeenCalled();
        expect(httpClient.endpoints.updateUserMe).toHaveBeenCalledWith(
          {
            authorization: `Bearer undefined`,
          },
          {
            active: true,
          },
        );
      });

      it('should return a rejected status', () => {
        expect(status).toBe(RegisterConfirmStatus.rejected);
      });

      it('should return an error message Unexpected error', () => {
        expect(errorMessage).toBe(UNAUTHORIZED_ERROR_MESSAGE);
      });
    });

    describe('when called, and token is null', () => {
      let createAuthByTokenResult: ReturnType<typeof createAuthByToken>;
      let status: RegisterConfirmStatus;
      let errorMessage: string | null;
      let renderResult: RenderHookResult<UseRegisterConfirmResult, unknown>;

      beforeAll(async () => {
        createAuthByTokenResult = Symbol() as unknown as ReturnType<
          typeof createAuthByToken
        >;

        tokenFixture = null;

        const payloadActionFixture: PayloadAction<AuthSerializedResponse> = {
          payload: {
            body: {
              jwt: 'jwt-fixture',
            },
            statusCode: 200,
          },
          type: 'sample-type',
        };

        (
          useAppSelector as unknown as jest.Mock<typeof useAppSelector>
        ).mockReturnValueOnce(tokenFixture);

        (
          createAuthByToken as unknown as jest.Mock<typeof createAuthByToken>
        ).mockReturnValueOnce(createAuthByTokenResult);

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

        await act(() => {
          renderResult = renderHook(() => useRegisterConfirm());
        });
        status = renderResult.result.current.status;
        errorMessage = renderResult.result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should called useDispatch()', () => {
        expect(dispatchMock).toHaveBeenCalled();
        expect(dispatchMock).toHaveBeenCalledWith(createAuthByTokenResult);
      });

      it('should called useSelector() ', () => {
        expect(useAppSelector).toHaveBeenCalled();
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should return a rejected status', () => {
        expect(status).toBe(RegisterConfirmStatus.rejected);
      });

      it('should return an error message Unexpected error', () => {
        expect(errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
      });
    });

    afterAll(() => {
      Object.defineProperty(window, 'location', {
        value: previousLocation,
        configurable: true,
      });
    });
  });

  describe('having a window with location.href without code query', () => {
    let previousLocation: Location;
    let locationFixture: URL;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL('http://corniegame.com/auth/path?code=');

      Object.defineProperty(window, 'location', {
        value: new URL(locationFixture),
        configurable: true,
      });
    });

    describe('when called, and code query not exists and the error grid is showed', () => {
      let createAuthByTokenResult: ReturnType<typeof createAuthByToken>;
      let registerConfirmResponseFixture: RegisterConfirmResponse;
      let serializableResponseFixture: RegisterConfirmSerializedResponse;
      let status: RegisterConfirmStatus;
      let errorMessage: string | null;
      let renderResult: RenderHookResult<UseRegisterConfirmResult, unknown>;

      beforeAll(async () => {
        createAuthByTokenResult = Symbol() as unknown as ReturnType<
          typeof createAuthByToken
        >;

        tokenFixture = null;

        const payloadActionFixture: PayloadAction<AuthSerializedResponse> = {
          payload: {
            body: {
              jwt: 'jwt-fixture',
            },
            statusCode: 200,
          },
          type: 'sample-type',
        };

        (
          useAppSelector as unknown as jest.Mock<typeof useAppSelector>
        ).mockReturnValueOnce(tokenFixture);

        (
          createAuthByToken as unknown as jest.Mock<typeof createAuthByToken>
        ).mockReturnValueOnce(createAuthByTokenResult);

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

        await act(() => {
          renderResult = renderHook(() => useRegisterConfirm());
        });

        status = renderResult.result.current.status;
        errorMessage = renderResult.result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should called useDispatch()', () => {
        expect(dispatchMock).toHaveBeenCalled();
        expect(dispatchMock).toHaveBeenCalledWith(createAuthByTokenResult);
      });

      it('should called useSelector() ', () => {
        expect(useAppSelector).toHaveBeenCalled();
        expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should return a rejected status', () => {
        expect(status).toBe(RegisterConfirmStatus.rejected);
      });

      it('should return an error message Unexpected error', () => {
        expect(errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
      });
    });

    afterAll(() => {
      Object.defineProperty(window, 'location', {
        value: previousLocation,
        configurable: true,
      });
    });
  });
});
