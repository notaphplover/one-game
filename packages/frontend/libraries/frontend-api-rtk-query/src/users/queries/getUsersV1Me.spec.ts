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
import { GetUsersV1MeArgs } from '../models/GetUsersV1MeArgs';
import { getUsersV1Me } from './getUsersV1Me';

describe(getUsersV1Me.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let getUsersV1MeFunction: (
      args: GetUsersV1MeArgs,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.UserV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          getUserMe: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      getUsersV1MeFunction = getUsersV1Me(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: GetUsersV1MeArgs;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.getUserMe() returns a GetUsersV1MeResult with 200 http status code', () => {
        let resultFixture: HttpApiResult<'getUserMe'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.UserV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.getUserMe.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1MeFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUserMe()', () => {
          expect(httpClientMock.endpoints.getUserMe).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUserMe).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.UserV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getUserMe() returns a GetUsersV1MeResult with 401 http status code', () => {
        let resultFixture: HttpApiResult<'getUserMe'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.getUserMe.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1MeFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUserMe()', () => {
          expect(httpClientMock.endpoints.getUserMe).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUserMe).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.UserV1,
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

      describe('when called, and httpClient.endpoints.getUserMe() returns a GetUsersV1MeResult with 403 http status code', () => {
        let resultFixture: HttpApiResult<'getUserMe'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.getUserMe.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1MeFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUserMe()', () => {
          expect(httpClientMock.endpoints.getUserMe).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUserMe).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.UserV1,
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
