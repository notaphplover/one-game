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
import { GetGamesSpecsV1Args } from '../models/GetGamesSpecsV1Args';
import { getGamesSpecsV1 } from './getGamesSpecsV1';

describe(getGamesSpecsV1.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let getGamesSpecsV1Function: (
      args: GetGamesSpecsV1Args,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.GameSpecArrayV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          getGamesSpecs: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      getGamesSpecsV1Function = getGamesSpecsV1(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: GetGamesSpecsV1Args;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [Symbol() as unknown as Record<string, string>],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.getGamesSpecs() returns a GetGamesSpecsV1Result with 200 http status code', () => {
        let resultFixture: HttpApiResult<'getGamesSpecs'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.GameSpecArrayV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.getGamesSpecs.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesSpecsV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesSpecs()', () => {
          expect(httpClientMock.endpoints.getGamesSpecs).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesSpecs).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSpecArrayV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getGamesSpecs() returns a GetGamesSpecsV1Result with 401 http status code', () => {
        let resultFixture: HttpApiResult<'getGamesSpecs'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.getGamesSpecs.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesSpecsV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesSpecs()', () => {
          expect(httpClientMock.endpoints.getGamesSpecs).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesSpecs).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSpecArrayV1,
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

      describe('when called, and httpClient.endpoints.getGamesSpecs() returns a GetGamesSpecsV1Result with 403 http status code', () => {
        let resultFixture: HttpApiResult<'getGamesSpecs'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.getGamesSpecs.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesSpecsV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesSpecs()', () => {
          expect(httpClientMock.endpoints.getGamesSpecs).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesSpecs).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSpecArrayV1,
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
