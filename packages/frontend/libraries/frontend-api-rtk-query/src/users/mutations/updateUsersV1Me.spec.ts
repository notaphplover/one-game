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
import { UpdateUsersV1MeArgs } from '../models/UpdateUsersV1MeArgs';
import { updateUsersV1Me } from './updateUsersV1Me';

describe(updateUsersV1Me.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let updateUsersV1MeFunction: (
      args: UpdateUsersV1MeArgs,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.UserV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          updateUserMe: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      updateUsersV1MeFunction = updateUsersV1Me(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: UpdateUsersV1MeArgs;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [Symbol() as unknown as apiModels.GameCreateQueryV1],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.updateUserMe() returns a CreateGamesV1Result with 200 http status code', () => {
        let resultFixture: HttpApiResult<'updateUserMe'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.UserV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.updateUserMe.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateUsersV1MeFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateUserMe()', () => {
          expect(httpClientMock.endpoints.updateUserMe).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.updateUserMe).toHaveBeenCalledWith(
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

      describe('when called, and httpClient.endpoints.updateUserMe() returns a CreateGamesV1Result with 401 http status code', () => {
        let resultFixture: HttpApiResult<'updateUserMe'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.updateUserMe.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateUsersV1MeFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateUserMe()', () => {
          expect(httpClientMock.endpoints.updateUserMe).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.updateUserMe).toHaveBeenCalledWith(
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

      describe('when called, and httpClient.endpoints.updateUserMe() returns a CreateGamesV1Result with 403 http status code', () => {
        let resultFixture: HttpApiResult<'updateUserMe'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.updateUserMe.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateUsersV1MeFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateUserMe()', () => {
          expect(httpClientMock.endpoints.updateUserMe).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.updateUserMe).toHaveBeenCalledWith(
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
