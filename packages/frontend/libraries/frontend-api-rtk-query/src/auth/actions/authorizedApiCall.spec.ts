import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BaseQueryApi } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { AuthorizedEndpointsOptions } from '../models/AuthorizedEndpointsOptions';
import { authorizedApiCall } from './authorizedApiCall';

interface TestResult {
  foo: string;
}

interface TestState {
  bar: string;
}

describe(authorizedApiCall.name, () => {
  let callMock: jest.Mock<
    (
      args: unknown[],
    ) => Promise<QueryReturnValue<TestResult, SerializableAppError, never>>
  >;
  let optionsMock: jest.Mocked<AuthorizedEndpointsOptions<TestState>>;

  beforeAll(() => {
    callMock = jest.fn();
    optionsMock = {
      createAuthV2: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      mutex: {
        acquire: jest.fn(),
        release: jest.fn(),
        waitForUnlock: jest.fn(),
      } as Partial<jest.Mocked<Mutex>> as jest.Mocked<Mutex>,
      selectRefreshToken: jest.fn(),
    };
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

        it('should call call()', () => {
          expect(callMock).toHaveBeenCalledTimes(1);
          expect(callMock).toHaveBeenCalledWith(argsFixture);
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
    });
  });
});
