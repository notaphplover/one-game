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
  CONFLICT,
  CREATED,
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { CreateUsersV1EmailCodeArgs } from '../models/CreateUsersV1EmailCodeArgs';
import { createUsersV1EmailCode } from './createUsersV1EmailCode';

describe(createUsersV1EmailCode.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let createUsersV1EmailCodeFunction: (
      args: CreateUsersV1EmailCodeArgs,
      api: BaseQueryApi,
    ) => Promise<QueryReturnValue<undefined, SerializableAppError, never>>;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          createUserByEmailCode: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      createUsersV1EmailCodeFunction = createUsersV1EmailCode(httpClientMock);
    });

    describe('having args and api', () => {
      let argsFixture: CreateUsersV1EmailCodeArgs;
      let apiFixture: BaseQueryApi;

      beforeAll(() => {
        argsFixture = {
          params: [
            {
              email: 'mail@sample.com',
            },
            Symbol() as unknown as apiModels.UserCodeCreateQueryV1,
          ],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
      });

      describe('when called, and httpClient.endpoints.createUserByEmailCode() returns a CreateGamesV1Result with 201 http status code', () => {
        let resultFixture: HttpApiResult<'createUserByEmailCode'> &
          Response<Record<string, string>, unknown, typeof CREATED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: undefined,
            headers: {},
            statusCode: CREATED,
          };

          httpClientMock.endpoints.createUserByEmailCode.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createUsersV1EmailCodeFunction(
            argsFixture,
            apiFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createUserByEmailCode()', () => {
          expect(
            httpClientMock.endpoints.createUserByEmailCode,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.createUserByEmailCode,
          ).toHaveBeenCalledWith({}, ...argsFixture.params);
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            undefined,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.createUserByEmailCode() returns a CreateGamesV1Result with 409 http status code', () => {
        let resultFixture: HttpApiResult<'createUserByEmailCode'> &
          Response<Record<string, string>, unknown, typeof CONFLICT>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: CONFLICT,
          };

          httpClientMock.endpoints.createUserByEmailCode.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createUsersV1EmailCodeFunction(
            argsFixture,
            apiFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createUserByEmailCode()', () => {
          expect(
            httpClientMock.endpoints.createUserByEmailCode,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.createUserByEmailCode,
          ).toHaveBeenCalledWith({}, ...argsFixture.params);
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            undefined,
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

      describe('when called, and httpClient.endpoints.createUserByEmailCode() returns a CreateGamesV1Result with 422 http status code', () => {
        let resultFixture: HttpApiResult<'createUserByEmailCode'> &
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

          httpClientMock.endpoints.createUserByEmailCode.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createUsersV1EmailCodeFunction(
            argsFixture,
            apiFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createUserByEmailCode()', () => {
          expect(
            httpClientMock.endpoints.createUserByEmailCode,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.createUserByEmailCode,
          ).toHaveBeenCalledWith({}, ...argsFixture.params);
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            undefined,
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
