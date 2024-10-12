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
  OK,
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { DeleteUsersV1EmailCodeArgs } from '../models/DeleteUsersV1EmailCodeArgs';
import { deleteUsersV1EmailCode } from './deleteUsersV1EmailCode';

describe(deleteUsersV1EmailCode.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let deleteUsersV1EmailCodeFunction: (
      args: DeleteUsersV1EmailCodeArgs,
      api: BaseQueryApi,
    ) => Promise<QueryReturnValue<undefined, SerializableAppError, never>>;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          deleteUserByEmailCode: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      deleteUsersV1EmailCodeFunction = deleteUsersV1EmailCode(httpClientMock);
    });

    describe('having args and api', () => {
      let argsFixture: DeleteUsersV1EmailCodeArgs;
      let apiFixture: BaseQueryApi;

      beforeAll(() => {
        argsFixture = {
          params: [
            {
              email: 'mail@sample.com',
            },
          ],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
      });

      describe('when called, and httpClient.endpoints.createUserByEmailCode() returns a DeleteUsersV1EmailCodeResult with 200 http status code', () => {
        let resultFixture: HttpApiResult<'deleteUserByEmailCode'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: undefined,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.deleteUserByEmailCode.mockResolvedValueOnce(
            resultFixture,
          );

          result = await deleteUsersV1EmailCodeFunction(
            argsFixture,
            apiFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.deleteUserByEmailCode()', () => {
          expect(
            httpClientMock.endpoints.deleteUserByEmailCode,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.deleteUserByEmailCode,
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

      describe('when called, and httpClient.endpoints.deleteUserByEmailCode() returns a DeleteUsersV1EmailCodeResult with 422 http status code', () => {
        let resultFixture: HttpApiResult<'deleteUserByEmailCode'> &
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

          httpClientMock.endpoints.deleteUserByEmailCode.mockResolvedValueOnce(
            resultFixture,
          );

          result = await deleteUsersV1EmailCodeFunction(
            argsFixture,
            apiFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createUserByEmailCode()', () => {
          expect(
            httpClientMock.endpoints.deleteUserByEmailCode,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.deleteUserByEmailCode,
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
