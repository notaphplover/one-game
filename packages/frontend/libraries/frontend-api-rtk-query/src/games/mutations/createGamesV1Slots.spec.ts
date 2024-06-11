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
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { CreateGamesV1SlotsArgs } from '../models/CreateGamesV1SlotsArgs';
import { createGamesV1Slots } from './createGamesV1Slots';

describe(createGamesV1Slots.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let createGamesV1SlotsFunction: (
      args: CreateGamesV1SlotsArgs,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<
        apiModels.NonStartedGameSlotV1,
        SerializableAppError,
        never
      >
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          createGameSlot: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      createGamesV1SlotsFunction = createGamesV1Slots(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: CreateGamesV1SlotsArgs;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [
            { gameId: 'game-id-fixture' },
            Symbol() as unknown as apiModels.GameIdSlotCreateQueryV1,
          ],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.createGameSlot() returns a CreateGamesV1SlotsResult with 200 http status code', () => {
        let resultFixture: HttpApiResult<'createGameSlot'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.NonStartedGameSlotV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.createGameSlot.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1SlotsFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGameSlot()', () => {
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSlotV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.createGameSlot() returns a CreateGamesV1SlotsResult with 400 http status code', () => {
        let resultFixture: HttpApiResult<'createGameSlot'> &
          Response<Record<string, string>, unknown, typeof BAD_REQUEST>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: BAD_REQUEST,
          };

          httpClientMock.endpoints.createGameSlot.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1SlotsFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGameSlot()', () => {
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSlotV1,
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

      describe('when called, and httpClient.endpoints.createGameSlot() returns a CreateGamesV1SlotsResult with 401 http status code', () => {
        let resultFixture: HttpApiResult<'createGameSlot'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.createGameSlot.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1SlotsFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGameSlot()', () => {
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSlotV1,
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

      describe('when called, and httpClient.endpoints.createGameSlot() returns a CreateGamesV1SlotsResult with 403 http status code', () => {
        let resultFixture: HttpApiResult<'createGameSlot'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.createGameSlot.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1SlotsFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGameSlot()', () => {
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSlotV1,
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

      describe('when called, and httpClient.endpoints.createGameSlot() returns a CreateGamesV1SlotsResult with 409 http status code', () => {
        let resultFixture: HttpApiResult<'createGameSlot'> &
          Response<Record<string, string>, unknown, typeof CONFLICT>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: CONFLICT,
          };

          httpClientMock.endpoints.createGameSlot.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1SlotsFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGameSlot()', () => {
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSlotV1,
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

      describe('when called, and httpClient.endpoints.createGameSlot() returns a CreateGamesV1SlotsResult with 422 http status code', () => {
        let resultFixture: HttpApiResult<'createGameSlot'> &
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

          httpClientMock.endpoints.createGameSlot.mockResolvedValueOnce(
            resultFixture,
          );

          result = await createGamesV1SlotsFunction(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.createGameSlot()', () => {
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.createGameSlot).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.GameSlotV1,
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
