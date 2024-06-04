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
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { CreateGamesV1Args } from '../models/CreateGamesV1Args';
import { createGamesV1 } from './createGamesV1';

describe(createGamesV1.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let createGamesV1Function: (
      args: CreateGamesV1Args,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.GameV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          createGame: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      createGamesV1Function = createGamesV1(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: CreateGamesV1Args;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [Symbol() as unknown as apiModels.GameCreateQueryV1],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.createGame() returns a CreateGamesV1Result with 200 http status code', () => {
        let resultFixture: HttpApiResult<'createGame'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.NonStartedGameV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.createGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGame()', () => {
          expect(httpClientMock.endpoints.createGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.createGame).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.createGame() returns a CreateGamesV1Result with 400 http status code', () => {
        let resultFixture: HttpApiResult<'createGame'> &
          Response<Record<string, string>, unknown, typeof BAD_REQUEST>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: BAD_REQUEST,
          };

          httpClientMock.endpoints.createGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGame()', () => {
          expect(httpClientMock.endpoints.createGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.createGame).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameV1,
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

      describe('when called, and httpClient.endpoints.createGame() returns a CreateGamesV1Result with 401 http status code', () => {
        let resultFixture: HttpApiResult<'createGame'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.createGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGame()', () => {
          expect(httpClientMock.endpoints.createGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.createGame).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameV1,
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

      describe('when called, and httpClient.endpoints.createGame() returns a CreateGamesV1Result with 403 http status code', () => {
        let resultFixture: HttpApiResult<'createGame'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.createGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGame()', () => {
          expect(httpClientMock.endpoints.createGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.createGame).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameV1,
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
