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
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetGamesV1GameIdSlotsSlotIdCardsArgs } from '../models/GetGamesV1GameIdSlotsSlotIdCardsArgs';
import { getGamesV1GameIdSlotsSlotIdCards } from './getGamesV1GameIdSlotsSlotIdCards';

describe(getGamesV1GameIdSlotsSlotIdCards.name, () => {
  describe('having an httpClient', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    let getGamesV1Function: (
      args: GetGamesV1GameIdSlotsSlotIdCardsArgs,
      api: BaseQueryApi,
      accessToken: string | null,
    ) => Promise<
      QueryReturnValue<apiModels.CardArrayV1, SerializableAppError, never>
    >;

    beforeAll(() => {
      httpClientMock = {
        endpoints: {
          getGameSlotCards: jest.fn(),
        } as Partial<
          jest.Mocked<HttpClientEndpoints>
        > as jest.Mocked<HttpClientEndpoints>,
      } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

      getGamesV1Function = getGamesV1GameIdSlotsSlotIdCards(httpClientMock);
    });

    describe('having args, api, and accessToken', () => {
      let argsFixture: GetGamesV1GameIdSlotsSlotIdCardsArgs;
      let apiFixture: BaseQueryApi;
      let accessTokenFixture: string;

      beforeAll(() => {
        argsFixture = {
          params: [
            {
              gameId: 'game-id-fixture',
              gameSlotIndex: '0',
            },
          ],
        };
        apiFixture = Symbol() as unknown as BaseQueryApi;
        accessTokenFixture = 'access-token-fixture';
      });

      describe('when called, and httpClient.endpoints.getGameSlotCards() returns a GetGamesV1GameIdSlotsSlotIdCardsResult with 200 http status code', () => {
        let resultFixture: HttpApiResult<'getGameSlotCards'> &
          Response<Record<string, string>, unknown, typeof OK>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.CardArrayV1,
            headers: {},
            statusCode: OK,
          };

          httpClientMock.endpoints.getGameSlotCards.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGameSlotCards()', () => {
          expect(
            httpClientMock.endpoints.getGameSlotCards,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.getGameSlotCards,
          ).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.CardArrayV1,
            SerializableAppError,
            never
          > = {
            data: resultFixture.body,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and httpClient.endpoints.getGameSlotCards() returns a GetGamesV1GameIdSlotsSlotIdCardsResult with 401 http status code', () => {
        let resultFixture: HttpApiResult<'getGameSlotCards'> &
          Response<Record<string, string>, unknown, typeof UNAUTHORIZED>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: UNAUTHORIZED,
          };

          httpClientMock.endpoints.getGameSlotCards.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGameSlotCards()', () => {
          expect(
            httpClientMock.endpoints.getGameSlotCards,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.getGameSlotCards,
          ).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.CardArrayV1,
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

      describe('when called, and httpClient.endpoints.getGameSlotCards() returns a GetGamesV1GameIdSlotsSlotIdCardsResult with 403 http status code', () => {
        let resultFixture: HttpApiResult<'getGameSlotCards'> &
          Response<Record<string, string>, unknown, typeof FORBIDDEN>;

        let result: unknown;

        beforeAll(async () => {
          resultFixture = {
            body: Symbol() as unknown as apiModels.ErrorV1,
            headers: {},
            statusCode: FORBIDDEN,
          };

          httpClientMock.endpoints.getGameSlotCards.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGameSlotCards()', () => {
          expect(
            httpClientMock.endpoints.getGameSlotCards,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.getGameSlotCards,
          ).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.CardArrayV1,
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

      describe('when called, and httpClient.endpoints.getGameSlotCards() returns a GetGamesV1GameIdSlotsSlotIdCardsResult with 422 http status code', () => {
        let resultFixture: HttpApiResult<'getGameSlotCards'> &
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

          httpClientMock.endpoints.getGameSlotCards.mockResolvedValueOnce(
            resultFixture,
          );

          result = await getGamesV1Function(
            argsFixture,
            apiFixture,
            accessTokenFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGameSlotCards()', () => {
          expect(
            httpClientMock.endpoints.getGameSlotCards,
          ).toHaveBeenCalledTimes(1);
          expect(
            httpClientMock.endpoints.getGameSlotCards,
          ).toHaveBeenCalledWith(
            {
              authorization: `Bearer ${accessTokenFixture}`,
            },
            ...argsFixture.params,
          );
        });

        it('should return QueryReturnValue', () => {
          const expected: QueryReturnValue<
            apiModels.CardArrayV1,
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
