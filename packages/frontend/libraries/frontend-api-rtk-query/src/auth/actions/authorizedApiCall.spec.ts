import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';
import { Mutex, MutexInterface } from 'async-mutex';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { AuthorizedEndpointsOptions } from '../models/AuthorizedEndpointsOptions';
import { CreateAuthV2Args } from '../models/CreateAuthV2Args';
import { authorizedApiCall } from './authorizedApiCall';

interface TestResult {
  foo: string;
}

interface TestState {
  bar: string;
}

describe(authorizedApiCall.name, () => {
  let accessTokenFixture: string;
  let callMock: jest.Mock<
    (
      args: unknown[],
    ) => Promise<QueryReturnValue<TestResult, SerializableAppError, never>>
  >;

  let mutexReleaserMock: jest.Mock<MutexInterface.Releaser>;

  let optionsMock: jest.Mocked<AuthorizedEndpointsOptions<TestState>>;

  beforeAll(() => {
    accessTokenFixture = 'access-token-fixture';
    callMock = jest.fn();

    mutexReleaserMock = jest.fn();

    optionsMock = {
      createAuthV2: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      mutex: {
        acquire: jest.fn(),
        isLocked: jest.fn(),
        release: jest.fn(),
        waitForUnlock: jest.fn().mockReturnValue(Promise.resolve(undefined)),
      } as Partial<jest.Mocked<Mutex>> as jest.Mocked<Mutex>,
      selectAccessToken: jest.fn(),
      selectRefreshToken: jest.fn(),
    };

    optionsMock.mutex.acquire.mockResolvedValue(mutexReleaserMock);
    optionsMock.selectAccessToken.mockReturnValue(accessTokenFixture);
  });

  describe('when called', () => {
    let authorizedApiCallResult: (
      args: unknown[],
      api: BaseQueryApi,
    ) => Promise<QueryReturnValue<TestResult, SerializableAppError, never>>;

    beforeAll(() => {
      authorizedApiCallResult = authorizedApiCall(callMock, optionsMock);
    });

    it('should return a function', () => {
      expect(authorizedApiCallResult).toBeInstanceOf(Function);
    });

    describe('authorizedApiCallResult', () => {
      let apiMock: jest.Mocked<BaseQueryApi>;
      let argsFixture: unknown[];
      let stateFixture: TestState;

      beforeAll(() => {
        stateFixture = {
          bar: 'foo',
        };
        apiMock = {
          dispatch: jest.fn(),
          getState: jest.fn().mockReturnValue(stateFixture),
        } as Partial<jest.Mocked<BaseQueryApi>> as jest.Mocked<BaseQueryApi>;
        argsFixture = [Symbol()];
      });

      describe('when authorizedApiCallResult is called', () => {
        let callResultFixture: TestResult;

        let result: unknown;

        beforeAll(async () => {
          callResultFixture = {
            foo: 'bar',
          };

          callMock.mockResolvedValueOnce({
            data: callResultFixture,
          });

          result = await authorizedApiCallResult(argsFixture, apiMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call options.mutex.waitForUnlock()', () => {
          expect(optionsMock.mutex.waitForUnlock).toHaveBeenCalledTimes(1);
          expect(optionsMock.mutex.waitForUnlock).toHaveBeenCalledWith();
        });

        it('should call call()', () => {
          expect(callMock).toHaveBeenCalledTimes(1);
          expect(callMock).toHaveBeenCalledWith(
            argsFixture,
            apiMock,
            accessTokenFixture,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            TestResult,
            SerializableAppError,
            never
          > = {
            data: callResultFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when authorizedApiCallResult is returns result with missing credentials error and mutex is locked ', () => {
        let secondCallResultFixture: TestResult;

        let result: unknown;

        beforeAll(async () => {
          secondCallResultFixture = {
            foo: 'bar',
          };

          optionsMock.mutex.isLocked.mockReturnValueOnce(true);

          callMock
            .mockResolvedValueOnce({
              error: {
                kind: AppErrorKind.missingCredentials,
                message: 'sample message',
              },
            })
            .mockResolvedValueOnce({
              data: secondCallResultFixture,
            });

          result = await authorizedApiCallResult(argsFixture, apiMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call options.mutex.waitForUnlock()', () => {
          expect(optionsMock.mutex.waitForUnlock).toHaveBeenCalledTimes(2);
          expect(optionsMock.mutex.waitForUnlock).toHaveBeenNthCalledWith(1);
          expect(optionsMock.mutex.waitForUnlock).toHaveBeenNthCalledWith(2);
        });

        it('should call call()', () => {
          expect(callMock).toHaveBeenCalledTimes(2);
          expect(callMock).toHaveBeenNthCalledWith(
            1,
            argsFixture,
            apiMock,
            accessTokenFixture,
          );
          expect(callMock).toHaveBeenNthCalledWith(
            2,
            argsFixture,
            apiMock,
            accessTokenFixture,
          );
        });

        it('should call options.mutex.isLocked()', () => {
          expect(optionsMock.mutex.isLocked).toHaveBeenCalledTimes(1);
          expect(optionsMock.mutex.isLocked).toHaveBeenCalledWith();
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            TestResult,
            SerializableAppError,
            never
          > = {
            data: secondCallResultFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when authorizedApiCallResult is returns result with missing credentials error and mutex is not locked and createAuthV2 returns data', () => {
        let authV2Fixture: apiModels.AuthV2;
        let refreshTokenFixture: string;

        let secondCallResultFixture: TestResult;

        let result: unknown;

        beforeAll(async () => {
          authV2Fixture = {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          };
          refreshTokenFixture = 'refresh-token';

          secondCallResultFixture = {
            foo: 'bar',
          };

          optionsMock.mutex.isLocked.mockReturnValueOnce(false);

          optionsMock.selectRefreshToken.mockReturnValueOnce(
            refreshTokenFixture,
          );

          optionsMock.createAuthV2.mockResolvedValueOnce({
            data: authV2Fixture,
          });

          callMock
            .mockResolvedValueOnce({
              error: {
                kind: AppErrorKind.missingCredentials,
                message: 'sample message',
              },
            })
            .mockResolvedValueOnce({
              data: secondCallResultFixture,
            });

          result = await authorizedApiCallResult(argsFixture, apiMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call options.mutex.waitForUnlock()', () => {
          expect(optionsMock.mutex.waitForUnlock).toHaveBeenCalledTimes(2);
          expect(optionsMock.mutex.waitForUnlock).toHaveBeenNthCalledWith(1);
          expect(optionsMock.mutex.waitForUnlock).toHaveBeenNthCalledWith(2);
        });

        it('should call call()', () => {
          expect(callMock).toHaveBeenCalledTimes(2);
          expect(callMock).toHaveBeenNthCalledWith(
            1,
            argsFixture,
            apiMock,
            accessTokenFixture,
          );
          expect(callMock).toHaveBeenNthCalledWith(
            2,
            argsFixture,
            apiMock,
            accessTokenFixture,
          );
        });

        it('should call options.mutex.isLocked()', () => {
          expect(optionsMock.mutex.isLocked).toHaveBeenCalledTimes(1);
          expect(optionsMock.mutex.isLocked).toHaveBeenCalledWith();
        });

        it('should call api.getState()', () => {
          expect(apiMock.getState).toHaveBeenCalledTimes(3);
          expect(apiMock.getState).toHaveBeenCalledWith();
        });

        it('should call options.selectRefreshToken()', () => {
          expect(optionsMock.selectRefreshToken).toHaveBeenCalledTimes(1);
          expect(optionsMock.selectRefreshToken).toHaveBeenCalledWith(
            stateFixture,
          );
        });

        it('should call options.mutex.acquire()', () => {
          expect(optionsMock.mutex.acquire).toHaveBeenCalledTimes(1);
          expect(optionsMock.mutex.acquire).toHaveBeenCalledWith();
        });

        it('should call options.createAuthV2()', () => {
          const expected: CreateAuthV2Args = {
            refreshToken: refreshTokenFixture,
          };

          expect(optionsMock.createAuthV2).toHaveBeenCalledTimes(1);
          expect(optionsMock.createAuthV2).toHaveBeenCalledWith(expected);
        });

        it('should call options.login()', () => {
          expect(optionsMock.login).toHaveBeenCalledTimes(1);
          expect(optionsMock.login).toHaveBeenCalledWith(authV2Fixture);
        });

        it('should call api.dispatch()', () => {
          expect(apiMock.dispatch).toHaveBeenCalledTimes(1);
        });

        it('should call release()', () => {
          expect(mutexReleaserMock).toHaveBeenCalledTimes(1);
          expect(mutexReleaserMock).toHaveBeenCalledWith();
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            TestResult,
            SerializableAppError,
            never
          > = {
            data: secondCallResultFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
