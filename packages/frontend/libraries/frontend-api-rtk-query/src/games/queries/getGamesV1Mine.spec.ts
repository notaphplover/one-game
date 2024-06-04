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
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetGamesV1MineArgs } from '../models/GetGamesV1MineArgs';
import { getGamesV1Mine } from './getGamesV1Mine';

describe(getGamesV1Mine.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let getGamesV1MineFunction: (
      args: GetGamesV1MineArgs,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.GameArrayV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          getGamesMine: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      getGamesV1MineFunction = getGamesV1Mine(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: GetGamesV1MineArgs;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [Symbol() as unknown as Record<string, string>],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.getGamesMine() returns a CreateGamesV1Result with 200 http status code', () => {
        let resultFixture: HttpApiResult<'getGamesMine'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.GameArrayV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.getGamesMine.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesV1MineFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesMine()', () => {
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameArrayV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getGamesMine() returns a CreateGamesV1Result with 400 http status code', () => {
        let resultFixture: HttpApiResult<'getGamesMine'> &
          Response<Record<string, string>, unknown, typeof BAD_REQUEST>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: BAD_REQUEST,
          };

          httpClientMock.endpoints.getGamesMine.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesV1MineFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesMine()', () => {
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameArrayV1,
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

      describe('when called, and httpClient.endpoints.getGamesMine() returns a CreateGamesV1Result with 401 http status code', () => {
        let resultFixture: HttpApiResult<'getGamesMine'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.getGamesMine.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesV1MineFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesMine()', () => {
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameArrayV1,
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
    });
  });
});
