import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  HttpClient,
  HttpClientEndpoints,
  Response,
} from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetUsersV1Args } from '../models/GetUsersV1Args';
import { getUsersV1 } from './getUsersV1';

describe(getUsersV1.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let getUsersV1Function: (
      args: GetUsersV1Args,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.MaybeUserArrayV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          getUsers: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      getUsersV1Function = getUsersV1(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: GetUsersV1Args;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [Symbol() as unknown as Record<string, string>],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.getUsers() returns a GetUsersV1Result with 200 http status code', () => {
        let resultFixture: HttpApiResult<'getUsers'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.MaybeUserArrayV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.getUsers.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUsers()', () => {
          expect(httpClientMock.endpoints.getUsers).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUsers).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.MaybeUserArrayV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getUsers() returns a GetUsersV1Result with 401 http status code', () => {
        let resultFixture: HttpApiResult<'getUsers'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.getUsers.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUsers()', () => {
          expect(httpClientMock.endpoints.getUsers).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUsers).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.MaybeUserArrayV1,
            SerializableAppError,
            never
          > = {
            error: {
              kind: AppErrorKind.missingCredentials,
              message: resultFixture.body.description,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getUsers() returns a GetUsersV1Result with 403 http status code', () => {
        let resultFixture: HttpApiResult<'getUsers'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.getUsers.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUsers()', () => {
          expect(httpClientMock.endpoints.getUsers).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUsers).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.MaybeUserArrayV1,
            SerializableAppError,
            never
          > = {
            error: {
              kind: AppErrorKind.invalidCredentials,
              message: resultFixture.body.description,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
