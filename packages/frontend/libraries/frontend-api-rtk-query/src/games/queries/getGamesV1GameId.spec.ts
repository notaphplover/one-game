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
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetGamesV1GameIdArgs } from '../models/GetGamesV1GameIdArgs';
import { getGamesV1GameId } from './getGamesV1GameId';

describe(getGamesV1GameId.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let getGamesV1Function: (
      args: GetGamesV1GameIdArgs,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<
        apiModels.GameV1 | undefined,
        SerializableAppError,
        never
      >
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          getGame: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      getGamesV1Function = getGamesV1GameId(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: GetGamesV1GameIdArgs;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [
            {
              gameId: 'game-id-fixture',
            },
          ],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.getGame() returns a GetGamesV1GameIdResult with 200 http status code', () => {
        let resultFixture: HttpApiResult<'getGame'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.GameV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.getGame.mockResolvedValueOnce(resultFixture);

          result = await getGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGame()', () => {
          expect(httpClientMock.endpoints.getGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getGame).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameV1 | undefined,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getGame() returns a GetGamesV1GameIdResult with 401 http status code', () => {
        let resultFixture: HttpApiResult<'getGame'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.getGame.mockResolvedValueOnce(resultFixture);

          result = await getGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGame()', () => {
          expect(httpClientMock.endpoints.getGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getGame).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameV1 | undefined,
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

      describe('when called, and httpClient.endpoints.getGame() returns a GetGamesV1GameIdResult with 403 http status code', () => {
        let resultFixture: HttpApiResult<'getGame'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.getGame.mockResolvedValueOnce(resultFixture);

          result = await getGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGame()', () => {
          expect(httpClientMock.endpoints.getGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getGame).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameV1 | undefined,
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

      describe('when called, and httpClient.endpoints.getGame() returns a GetGamesV1GameIdResult with 404 http status code', () => {
        let resultFixture: HttpApiResult<'getGame'> &
          Response<Record<string, string>, unknown, typeof NOT_FOUND>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: NOT_FOUND,
          };

          httpClientMock.endpoints.getGame.mockResolvedValueOnce(resultFixture);

          result = await getGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGame()', () => {
          expect(httpClientMock.endpoints.getGame).toHaveBeenCalledTimes(1);
          expect(httpClientMock.endpoints.getGame).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameV1 | undefined,
            SerializableAppError,
            never
          > = {
            data: undefined,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
