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
import { GetGamesGameIdSpecsV1Args } from '../models/GetGamesGameIdSpecsV1Args';
import { getGamesGameIdSpecsV1 } from './getGamesGameIdSpecsV1';

describe(getGamesGameIdSpecsV1.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let getGamesGameIdSpecsV1Function: (
      args: GetGamesGameIdSpecsV1Args,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.GameSpecV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          getGameGameIdSpec: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      getGamesGameIdSpecsV1Function = getGamesGameIdSpecsV1(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: GetGamesGameIdSpecsV1Args;
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

      describe('when called, and httpClient.endpoints.getGameGameIdSpec() returns a GetGamesSpecsV1Result with 200 http status code', () => {
        let resultFixture: HttpApiResult<'getGameGameIdSpec'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.GameSpecV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.getGameGameIdSpec.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesGameIdSpecsV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGameGameIdSpec()', () => {
          expect(
            httpClientMock.endpoints.getGameGameIdSpec,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.getGameGameIdSpec,
          ).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSpecV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getGameGameIdSpec() returns a GetGamesSpecsV1Result with 401 http status code', () => {
        let resultFixture: HttpApiResult<'getGameGameIdSpec'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.getGameGameIdSpec.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesGameIdSpecsV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGameGameIdSpec()', () => {
          expect(
            httpClientMock.endpoints.getGameGameIdSpec,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.getGameGameIdSpec,
          ).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSpecV1,
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

      describe('when called, and httpClient.endpoints.getGameGameIdSpec() returns a GetGamesSpecsV1Result with 403 http status code', () => {
        let resultFixture: HttpApiResult<'getGameGameIdSpec'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.getGameGameIdSpec.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesGameIdSpecsV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGameGameIdSpec()', () => {
          expect(
            httpClientMock.endpoints.getGameGameIdSpec,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.getGameGameIdSpec,
          ).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSpecV1,
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

      describe('when called, and httpClient.endpoints.getGameGameIdSpec() returns a GetGamesSpecsV1Result with 404 http status code', () => {
        let resultFixture: HttpApiResult<'getGameGameIdSpec'> &
          Response<Record<string, string>, unknown, typeof NOT_FOUND>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: NOT_FOUND,
          };

          httpClientMock.endpoints.getGameGameIdSpec.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesGameIdSpecsV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGameGameIdSpec()', () => {
          expect(
            httpClientMock.endpoints.getGameGameIdSpec,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.getGameGameIdSpec,
          ).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSpecV1,
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
    });
  });
});
