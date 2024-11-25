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
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { UpdateGameV1Args } from '../models/UpdateGameV1Args';
import { updateGameV1 } from './updateGameV1';

describe(updateGameV1.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let updateGameV1Function: (
      args: UpdateGameV1Args,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.GameV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          updateGame: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      updateGameV1Function = updateGameV1(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: UpdateGameV1Args;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [
            { gameId: 'gameId-fixture' },
            Symbol() as unknown as apiModels.GameIdUpdateQueryV1,
          ],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.updateGame() returns a UpdateGamesV1Result with 200 http status code', () => {
        let resultFixture: HttpApiResult<'updateGame'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.NonStartedGameV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.updateGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateGameV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateGame()', () => {
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledWith(
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

      describe('when called, and httpClient.endpoints.updateGame() returns a UpdateGamesV1Result with 400 http status code', () => {
        let resultFixture: HttpApiResult<'updateGame'> &
          Response<Record<string, string>, unknown, typeof BAD_REQUEST>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: BAD_REQUEST,
          };

          httpClientMock.endpoints.updateGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateGameV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateGame()', () => {
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledWith(
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

      describe('when called, and httpClient.endpoints.updateGame() returns a UpdateGamesV1Result with 401 http status code', () => {
        let resultFixture: HttpApiResult<'updateGame'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.updateGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateGameV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateGame()', () => {
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledWith(
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

      describe('when called, and httpClient.endpoints.updateGame() returns a UpdateGamesV1Result with 403 http status code', () => {
        let resultFixture: HttpApiResult<'updateGame'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.updateGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateGameV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateGame()', () => {
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledWith(
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

      describe('when called, and httpClient.endpoints.updateGame() returns a UpdateGamesV1Result with 404 http status code', () => {
        let resultFixture: HttpApiResult<'updateGame'> &
          Response<Record<string, string>, unknown, typeof NOT_FOUND>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: NOT_FOUND,
          };

          httpClientMock.endpoints.updateGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateGameV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateGame()', () => {
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledWith(
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
              kind: AppErrorKind.entityNotFound,
              message: resultFixture.body.description,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.updateGame() returns a UpdateGamesV1Result with 422 http status code', () => {
        let resultFixture: HttpApiResult<'updateGame'> &
          Response<
            Record<string, string>,
            unknown,
            typeof UNPROCESSABLE_CONTENT
          >;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNPROCESSABLE_CONTENT,
          };

          httpClientMock.endpoints.updateGame.mockResolvedValueOnce(
            resultFixture,
          );

          result = await updateGameV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.updateGame()', () => {
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.updateGame).toHaveBeenCalledWith(
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
              kind: AppErrorKind.unprocessableOperation,
              message: resultFixture.body.description,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
