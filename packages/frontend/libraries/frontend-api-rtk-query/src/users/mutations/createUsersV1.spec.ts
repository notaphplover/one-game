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
  BAD_REQUEST,
  CONFLICT,
  OK,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { CreateUsersV1Args } from '../models/CreateUsersV1Args';
import { createUsersV1 } from './createUsersV1';

describe(createUsersV1.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let createUsersV1Function: (
      args: CreateUsersV1Args,
      api: BaseQueryApi,
    ) => Promise<
      QueryReturnValue<apiModels.UserV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          createUser: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      createUsersV1Function = createUsersV1(httpClientMock);
    });

    describe('having args and api', () => {
      let argsFixture: CreateUsersV1Args;
      let apiFixture: BaseQueryApi;

      beforeAll(() => {
        argsFixture = {
          params: [Symbol() as unknown as apiModels.UserCreateQueryV1],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
      });

      describe('when called, and httpClient.endpoints.createUser() returns a CreateGamesV1Result with 200 http status code', () => {
        let resultFixture: HttpApiResult<'createUser'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.UserV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.createUser.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createUsersV1Function(argsFixture, apiFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createUser()', () => {
          expect(httpClientMock.endpoints.createUser).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.createUser).toHaveBeenCalledWith(
            {},
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

      describe('when called, and httpClient.endpoints.createUser() returns a CreateGamesV1Result with 400 http status code', () => {
        let resultFixture: HttpApiResult<'createUser'> &
          Response<Record<string, string>, unknown, typeof BAD_REQUEST>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: BAD_REQUEST,
          };

          httpClientMock.endpoints.createUser.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createUsersV1Function(argsFixture, apiFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createUser()', () => {
          expect(httpClientMock.endpoints.createUser).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.createUser).toHaveBeenCalledWith(
            {},
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
              kind: AppErrorKind.contractViolation,
              message: resultFixture.body.description,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.createUser() returns a CreateGamesV1Result with 409 http status code', () => {
        let resultFixture: HttpApiResult<'createUser'> &
          Response<Record<string, string>, unknown, typeof CONFLICT>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: CONFLICT,
          };

          httpClientMock.endpoints.createUser.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createUsersV1Function(argsFixture, apiFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createUser()', () => {
          expect(httpClientMock.endpoints.createUser).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.createUser).toHaveBeenCalledWith(
            {},
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
              kind: AppErrorKind.entityConflict,
              message: resultFixture.body.description,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
