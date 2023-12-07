import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { GameSpecFindQuery } from '@cornie-js/backend-game-domain/games';
import {
  AuthKind,
  AuthRequestContextHolder,
  Request,
  RequestService,
  requestContextProperty,
  RequestQueryParseFailureKind,
} from '@cornie-js/backend-http';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GetGamesV1SpecsRequestParamHandler } from './GetGamesV1SpecsRequestParamHandler';

describe(GetGamesV1SpecsRequestParamHandler.name, () => {
  let requestServiceMock: jest.Mocked<RequestService>;

  let getGamesV1SpecsRequestParamHandler: GetGamesV1SpecsRequestParamHandler;

  beforeAll(() => {
    requestServiceMock = {
      composeErrorMessages: jest.fn(),
      tryParseIntegerQuery: jest.fn(),
      tryParseStringQuery: jest.fn(),
    } as Partial<jest.Mocked<RequestService>> as jest.Mocked<RequestService>;

    getGamesV1SpecsRequestParamHandler = new GetGamesV1SpecsRequestParamHandler(
      requestServiceMock,
    );
  });

  describe('.handle', () => {
    describe('having a service Request', () => {
      let requestFixture: Request & AuthRequestContextHolder;

      beforeAll(() => {
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.backendService,
            },
          },
          urlParameters: {},
        };
      });

      describe('when called, and requestService returns game ids, page and pageSize', () => {
        let gameIdsFixture: string[];
        let pageFixture: number;
        let pageSizeFixture: number;

        let result: unknown;

        beforeAll(async () => {
          pageFixture = 1;
          pageSizeFixture = 10;
          gameIdsFixture = ['game-id-fixture'];

          requestServiceMock.tryParseStringQuery.mockReturnValueOnce({
            isRight: true,
            value: gameIdsFixture,
          });

          requestServiceMock.tryParseIntegerQuery
            .mockReturnValueOnce({
              isRight: true,
              value: pageFixture,
            })
            .mockReturnValueOnce({
              isRight: true,
              value: pageSizeFixture,
            });

          result =
            await getGamesV1SpecsRequestParamHandler.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return [GameSpecFindQuery] with an array with gameId', () => {
          const expectedGameSpecFindQuery: GameSpecFindQuery = {
            gameIds: gameIdsFixture,
            limit: 10,
            offset: 0,
          };

          expect(result).toStrictEqual([expectedGameSpecFindQuery]);
        });
      });

      describe('when called, and requestService returns left', () => {
        let errorFixture: string;

        let result: unknown;

        beforeAll(async () => {
          errorFixture = 'error-fixture';

          requestServiceMock.composeErrorMessages.mockReturnValueOnce([
            errorFixture,
          ]);

          requestServiceMock.tryParseStringQuery.mockReturnValueOnce({
            isRight: false,
            value: {
              errors: [],
              kind: RequestQueryParseFailureKind.invalidValue,
            },
          });

          requestServiceMock.tryParseIntegerQuery
            .mockReturnValueOnce({
              isRight: false,
              value: {
                errors: [],
                kind: RequestQueryParseFailureKind.invalidValue,
              },
            })
            .mockReturnValueOnce({
              isRight: false,
              value: {
                errors: [],
                kind: RequestQueryParseFailureKind.invalidValue,
              },
            });

          try {
            await getGamesV1SpecsRequestParamHandler.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.contractViolation,
            message: expect.stringContaining(errorFixture) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having a user Request', () => {
      let requestFixture: Request & AuthRequestContextHolder;

      beforeAll(() => {
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        };
      });

      describe('when called, and requestService returns no game ids, page and pageSize', () => {
        let gameIdsFixture: string[];
        let pageFixture: number;
        let pageSizeFixture: number;

        let result: unknown;

        beforeAll(async () => {
          pageFixture = 1;
          pageSizeFixture = 10;
          gameIdsFixture = [];

          requestServiceMock.tryParseStringQuery.mockReturnValueOnce({
            isRight: true,
            value: gameIdsFixture,
          });

          requestServiceMock.tryParseIntegerQuery
            .mockReturnValueOnce({
              isRight: true,
              value: pageFixture,
            })
            .mockReturnValueOnce({
              isRight: true,
              value: pageSizeFixture,
            });

          try {
            await getGamesV1SpecsRequestParamHandler.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.invalidCredentials,
            message: expect.any(String) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });
});
