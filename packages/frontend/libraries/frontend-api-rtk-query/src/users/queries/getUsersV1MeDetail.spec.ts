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
import { GetUsersV1MeDetailArgs } from '../models/GetUsersV1MeDetailArgs';
import { getUsersV1MeDetail } from './getUsersV1MeDetail';

describe(getUsersV1MeDetail.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let getUsersV1MeDetailFunction: (
      args: GetUsersV1MeDetailArgs,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.UserDetailV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          getUserMeDetail: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      getUsersV1MeDetailFunction = getUsersV1MeDetail(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: GetUsersV1MeDetailArgs;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.getUserMeDetail() returns a GetUsersV1MeDetailResult with 200 http status code', () => {
        let resultFixture: HttpApiResult<'getUserMeDetail'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.UserDetailV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.getUserMeDetail.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1MeDetailFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUserMeDetail()', () => {
          expect(
            httpClientMock.endpoints.getUserMeDetail,
          ).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUserMeDetail).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.UserDetailV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getUserMeDetail() returns a GetUsersV1MeDetailResult with 401 http status code', () => {
        let resultFixture: HttpApiResult<'getUserMeDetail'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.getUserMeDetail.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1MeDetailFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUserMeDetail()', () => {
          expect(
            httpClientMock.endpoints.getUserMeDetail,
          ).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUserMeDetail).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.UserDetailV1,
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

      describe('when called, and httpClient.endpoints.getUserMeDetail() returns a GetUsersV1MeDetailResult with 403 http status code', () => {
        let resultFixture: HttpApiResult<'getUserMeDetail'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.getUserMeDetail.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getUsersV1MeDetailFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getUserMeDetail()', () => {
          expect(
            httpClientMock.endpoints.getUserMeDetail,
          ).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getUserMeDetail).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.UserDetailV1,
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
