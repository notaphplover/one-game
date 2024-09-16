jest.mock('../../common/http/services/httpClient');
jest.mock('../../common/http/helpers/buildSerializableResponse');
jest.mock('../../common/hooks/useUrlLikeLocation');
jest.mock('../../app/store/thunk/createAuthByToken');
jest.mock('../../app/store/hooks');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { PayloadAction } from '@reduxjs/toolkit';
import { renderHook, RenderHookResult } from '@testing-library/react';
import { act } from 'react';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { createAuthByToken } from '../../app/store/thunk/createAuthByToken';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { AuthSerializedResponse } from '../../common/http/models/AuthSerializedResponse';
import { RegisterConfirmResponse } from '../../common/http/models/RegisterConfirmResponse';
import { RegisterConfirmSerializedResponse } from '../../common/http/models/RegisterConfirmSerializedResponse';
import { httpClient } from '../../common/http/services/httpClient';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
import { RegisterConfirmStatus } from '../models/RegisterConfirmStatus';
import { UseRegisterConfirmResult } from '../models/UseRegisterConfirmResult';
import {
  UNAUTHORIZED_ERROR_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
  useRegisterConfirm,
} from './useRegisterConfirm';

describe(useRegisterConfirm.name, () => {
  let dispatchMock: ReturnType<typeof useAppDispatch> &
    jest.Mock<ReturnType<typeof useAppDispatch>>;

  describe('when called, and useUrlLikeLocation returns location with code query and httpClient.endpoints.updateUserMe() returns an OK response', () => {
    let authenticatedAuthStateFixture: AuthenticatedAuthState;
    let createAuthByTokenResult: ReturnType<typeof createAuthByToken>;
    let registerConfirmResponseFixture: RegisterConfirmResponse;
    let serializableResponseFixture: RegisterConfirmSerializedResponse;
    let status: RegisterConfirmStatus;
    let urlLikeLocationFixture: UrlLikeLocation;
    let errorMessage: string | null;
    let renderResult: RenderHookResult<UseRegisterConfirmResult, unknown>;

    beforeAll(async () => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams('?code=code'),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      createAuthByTokenResult = Symbol() as unknown as ReturnType<
        typeof createAuthByToken
      >;

      authenticatedAuthStateFixture = {
        accessToken: 'accessToken-fixture',
        refreshToken: 'refreshToken-fixture',
        status: AuthStateStatus.authenticated,
      };

      registerConfirmResponseFixture = {
        body: {
          active: true,
          id: 'id',
          name: 'name',
        },
        headers: {},
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
            accessToken: 'accessToken-fixture',
            refreshToken: 'refreshToken-fixture',
          },
          statusCode: 200,
        },
        type: 'sample-type',
      };

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(authenticatedAuthStateFixture);

      (
        httpClient.endpoints.updateUserMe as jest.Mock<
          typeof httpClient.endpoints.updateUserMe
        >
      ).mockResolvedValueOnce(registerConfirmResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(serializableResponseFixture);

      (
        createAuthByToken as unknown as jest.Mock<typeof createAuthByToken>
      ).mockReturnValueOnce(createAuthByTokenResult);

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
          <TReturn, TAction>(): TAction | TReturn =>
            payloadActionFixture as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      // eslint-disable-next-line @typescript-eslint/await-thenable
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

    it('should call useUrlLikeLocation()', () => {
      expect(useUrlLikeLocation).toHaveBeenCalled();
    });

    it('should call useAppDispatch()', () => {
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(createAuthByTokenResult);
    });

    it('should call useAppSelector() ', () => {
      expect(useAppSelector).toHaveBeenCalled();
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call httpClient.endpoints.updateUserMe()', () => {
      expect(httpClient.endpoints.updateUserMe).toHaveBeenCalled();
      expect(httpClient.endpoints.updateUserMe).toHaveBeenCalledWith(
        {
          authorization: `Bearer ${authenticatedAuthStateFixture.accessToken}`,
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
    let authenticatedAuthStateFixture: AuthenticatedAuthState;
    let createAuthByTokenResult: ReturnType<typeof createAuthByToken>;
    let registerConfirmResponseFixture: RegisterConfirmResponse;
    let serializableResponseFixture: RegisterConfirmSerializedResponse;
    let status: RegisterConfirmStatus;
    let urlLikeLocationFixture: UrlLikeLocation;
    let errorMessage: string | null;
    let renderResult: RenderHookResult<UseRegisterConfirmResult, unknown>;

    beforeAll(async () => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams('?code=code'),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      createAuthByTokenResult = Symbol() as unknown as ReturnType<
        typeof createAuthByToken
      >;

      authenticatedAuthStateFixture = {
        accessToken: 'accessToken-fixture',
        refreshToken: 'refreshToken-fixture',
        status: AuthStateStatus.authenticated,
      };

      registerConfirmResponseFixture = {
        body: {
          description: 'Error Fixture',
        },
        headers: {},
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
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(authenticatedAuthStateFixture);

      (
        httpClient.endpoints.updateUserMe as jest.Mock<
          typeof httpClient.endpoints.updateUserMe
        >
      ).mockResolvedValueOnce(registerConfirmResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(serializableResponseFixture);

      (
        createAuthByToken as unknown as jest.Mock<typeof createAuthByToken>
      ).mockReturnValueOnce(createAuthByTokenResult);

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
          <TReturn, TAction>(): TAction | TReturn =>
            payloadActionFixture as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      // eslint-disable-next-line @typescript-eslint/await-thenable
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

    it('should call useUrlLikeLocation()', () => {
      expect(useUrlLikeLocation).toHaveBeenCalled();
    });

    it('should call useAppDispatch()', () => {
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(createAuthByTokenResult);
    });

    it('should call useAppSelector() ', () => {
      expect(useAppSelector).toHaveBeenCalled();
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call httpClient.endpoints.updateUserMe()', () => {
      expect(httpClient.endpoints.updateUserMe).toHaveBeenCalled();
      expect(httpClient.endpoints.updateUserMe).toHaveBeenCalledWith(
        {
          authorization: `Bearer ${authenticatedAuthStateFixture.accessToken}`,
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

  describe('when called, and accessToken is null', () => {
    let authenticatedAuthStateFixture: AuthenticatedAuthState | null;
    let createAuthByTokenResult: ReturnType<typeof createAuthByToken>;
    let status: RegisterConfirmStatus;
    let urlLikeLocationFixture: UrlLikeLocation;
    let errorMessage: string | null;
    let renderResult: RenderHookResult<UseRegisterConfirmResult, unknown>;

    beforeAll(async () => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams('?code=code'),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      createAuthByTokenResult = Symbol() as unknown as ReturnType<
        typeof createAuthByToken
      >;

      authenticatedAuthStateFixture = null;

      const payloadActionFixture: PayloadAction<AuthSerializedResponse> = {
        payload: {
          body: {
            accessToken: 'accessToken-fixture',
            refreshToken: 'refreshToken-fixture',
          },
          statusCode: 200,
        },
        type: 'sample-type',
      };

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(authenticatedAuthStateFixture);

      (
        createAuthByToken as unknown as jest.Mock<typeof createAuthByToken>
      ).mockReturnValueOnce(createAuthByTokenResult);

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
          <TReturn, TAction>(): TAction | TReturn =>
            payloadActionFixture as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      // eslint-disable-next-line @typescript-eslint/await-thenable
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

    it('should call useUrlLikeLocation()', () => {
      expect(useUrlLikeLocation).toHaveBeenCalled();
    });

    it('should call useDispatch()', () => {
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(createAuthByTokenResult);
    });

    it('should call useSelector() ', () => {
      expect(useAppSelector).toHaveBeenCalled();
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return a rejected status', () => {
      expect(status).toBe(RegisterConfirmStatus.pending);
    });

    it('should return an error message Unexpected error', () => {
      expect(errorMessage).toBeNull();
    });
  });

  describe('when called, and the error grid is showed', () => {
    let authenticatedAuthStateFixture: AuthenticatedAuthState | null;
    let createAuthByTokenResult: ReturnType<typeof createAuthByToken>;
    let status: RegisterConfirmStatus;
    let urlLikeLocationFixture: UrlLikeLocation;
    let errorMessage: string | null;
    let renderResult: RenderHookResult<UseRegisterConfirmResult, unknown>;

    beforeAll(async () => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams(),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      createAuthByTokenResult = Symbol() as unknown as ReturnType<
        typeof createAuthByToken
      >;

      authenticatedAuthStateFixture = null;

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(authenticatedAuthStateFixture);

      (
        createAuthByToken as unknown as jest.Mock<typeof createAuthByToken>
      ).mockReturnValueOnce(createAuthByTokenResult);

      dispatchMock = jest.fn<ReturnType<typeof useAppDispatch>>() as ReturnType<
        typeof useAppDispatch
      > &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      // eslint-disable-next-line @typescript-eslint/await-thenable
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

    it('should call useUrlLikeLocation()', () => {
      expect(useUrlLikeLocation).toHaveBeenCalled();
    });

    it('should not call useDispatch()', () => {
      expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('should call useSelector() ', () => {
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
});
