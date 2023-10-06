import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  STATUS_FULFILLED,
  STATUS_REJECTED,
  UNEXPECTED_ERROR_MESSAGE,
  useRegisterConfirm,
} from './useRegisterConfirm';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  };
});
jest.mock('../../common/http/services/HttpService');
jest.mock('../../common/http/helpers');

describe(useRegisterConfirm.name, () => {
  let authErrorMessageFixture;
  let dispatchMock;
  let tokenFixture;

  beforeAll(() => {
    authErrorMessageFixture = null;
    dispatchMock = jest.fn().mockResolvedValue(undefined);
    tokenFixture = null;
  });

  describe('having a window with location.href with code query', () => {
    let previousLocation;
    let locationFixture;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL('http://corniegame.com/auth/path?code=code');

      Object.defineProperty(window, 'location', {
        value: new URL(locationFixture),
        configurable: true,
      });
    });

    describe('when called, and httpClient.updateUserMe() returns an OK response', () => {
      let result;
      let status;
      let errorMessage;

      beforeAll(async () => {
        tokenFixture = 'jwt token fixture';

        useDispatch.mockReturnValue(dispatchMock);
        useSelector.mockImplementation(() => ({
          token: tokenFixture,
          errorMessage: authErrorMessageFixture,
        }));

        httpClient.updateUserMe.mockReturnValueOnce({
          headers: {},
          body: {
            active: true,
            id: 'id',
            name: 'name',
          },
          statusCode: 200,
        });

        buildSerializableResponse.mockImplementation((response) => ({
          body: response.body,
          statusCode: response.statusCode,
        }));

        await act(() => {
          result = renderHook(() => useRegisterConfirm()).result;
        });

        status = result.current.status;
        errorMessage = result.current.errorMessage;
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });

      it('should return a fulfilled status', () => {
        expect(status).toBe(STATUS_FULFILLED);
      });

      it('should return a null error message', () => {
        expect(errorMessage).toBeNull();
      });
    });

    describe('when called, and httpClient.updateUserMe() returns a non OK response', () => {
      let result;
      let status;
      let errorMessage;

      beforeAll(async () => {
        tokenFixture = 'jwt token fixture';
        authErrorMessageFixture = UNEXPECTED_ERROR_MESSAGE;

        useDispatch.mockReturnValue(dispatchMock);
        useSelector.mockImplementation(() => ({
          token: tokenFixture,
          errorMessage: authErrorMessageFixture,
        }));

        httpClient.updateUserMe.mockReturnValueOnce({
          headers: {},
          body: {
            code: null,
            description: 'Error Fixture',
            parameters: {},
          },
          statusCode: 401,
        });

        buildSerializableResponse.mockImplementation((response) => ({
          body: response.body,
          statusCode: response.statusCode,
        }));

        await act(() => {
          result = renderHook(() => useRegisterConfirm()).result;
        });
        status = result.current.status;
        errorMessage = result.current.errorMessage;
      });

      it('should return a rejected status', () => {
        expect(status).toBe(STATUS_REJECTED);
      });

      it('should return an error message Unexpected error', () => {
        expect(errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
      });
    });

    describe('when called, and token is null', () => {
      let result;
      let status;
      let errorMessage;

      beforeAll(async () => {
        tokenFixture = null;
        authErrorMessageFixture = UNEXPECTED_ERROR_MESSAGE;

        useDispatch.mockReturnValue(dispatchMock);
        useSelector.mockImplementation(() => ({
          token: tokenFixture,
          errorMessage: authErrorMessageFixture,
        }));

        await act(() => {
          result = renderHook(() => useRegisterConfirm()).result;
        });
        status = result.current.status;
        errorMessage = result.current.errorMessage;
      });

      it('should return a rejected status', () => {
        expect(status).toBe(STATUS_REJECTED);
      });

      it('should return an error message Unexpected error', () => {
        expect(errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
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
    let previousLocation;
    let locationFixture;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL('http://corniegame.com/auth/path?code=');

      Object.defineProperty(window, 'location', {
        value: new URL(locationFixture),
        configurable: true,
      });
    });

    describe('when called, and code query not exists and the error grid is showed', () => {
      let result;
      let status;
      let errorMessage;

      beforeAll(async () => {
        useDispatch.mockReturnValue(dispatchMock);
        useSelector.mockImplementation(() => ({
          token: tokenFixture,
          errorMessage: authErrorMessageFixture,
        }));

        await act(() => {
          result = renderHook(() => useRegisterConfirm()).result;
        });

        status = result.current.status;
        errorMessage = result.current.errorMessage;
      });

      it('should return a rejected status', () => {
        expect(status).toBe(STATUS_REJECTED);
      });

      it('should return an error message Unexpected error', () => {
        expect(errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
      });

      afterAll(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
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
