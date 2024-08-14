import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import {
  ApiJsonSchemasValidationProvider,
  Validator,
} from '@cornie-js/backend-api-validators';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  GameSpecFindQuery,
  GameSpecFindQuerySortOption,
} from '@cornie-js/backend-game-domain/games';
import {
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
  RequestQueryParseFailureKind,
  RequestService,
} from '@cornie-js/backend-http';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GetV1GamesSpecsRequestParamHandler } from './GetV1GamesSpecsRequestParamHandler';

describe(GetV1GamesSpecsRequestParamHandler.name, () => {
  let apiJsonSchemasValidationProviderMock: jest.Mocked<ApiJsonSchemasValidationProvider>;
  let gameSpecFindQuerySortOptionFromGameSpecSortOptionV1BuilderMock: jest.Mocked<
    Builder<GameSpecFindQuerySortOption, [apiModels.GameSpecSortOptionV1]>
  >;
  let gameSpecSortOptionValidatorMock: jest.Mocked<
    Validator<apiModels.GameSpecSortOptionV1>
  >;
  let requestServiceMock: jest.Mocked<RequestService>;

  let getGamesV1SpecsRequestParamHandler: GetV1GamesSpecsRequestParamHandler;

  beforeAll(() => {
    requestServiceMock = {
      composeErrorMessages: jest.fn(),
      tryParseIntegerQuery: jest.fn(),
      tryParseStringQuery: jest.fn(),
    } as Partial<jest.Mocked<RequestService>> as jest.Mocked<RequestService>;

    gameSpecSortOptionValidatorMock = {
      validate: jest.fn() as unknown,
    } as Partial<
      jest.Mocked<Validator<apiModels.GameSpecSortOptionV1>>
    > as jest.Mocked<Validator<apiModels.GameSpecSortOptionV1>>;

    apiJsonSchemasValidationProviderMock = {
      provide: jest.fn().mockReturnValueOnce(gameSpecSortOptionValidatorMock),
    } as Partial<
      jest.Mocked<ApiJsonSchemasValidationProvider>
    > as jest.Mocked<ApiJsonSchemasValidationProvider>;

    gameSpecFindQuerySortOptionFromGameSpecSortOptionV1BuilderMock = {
      build: jest.fn(),
    };

    getGamesV1SpecsRequestParamHandler = new GetV1GamesSpecsRequestParamHandler(
      apiJsonSchemasValidationProviderMock,
      gameSpecFindQuerySortOptionFromGameSpecSortOptionV1BuilderMock,
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

      describe('when called, and requestService returns game ids, page pageSize and sort', () => {
        let gameIdsFixture: string[];
        let pageFixture: number;
        let pageSizeFixture: number;
        let sortOptionV1Fixture: apiModels.GameSpecSortOptionV1;

        let gameSpecFindQuerySortOptionFixture: GameSpecFindQuerySortOption;

        let result: unknown;

        beforeAll(async () => {
          pageFixture = 1;
          pageSizeFixture = 10;
          gameIdsFixture = ['game-id-fixture'];
          sortOptionV1Fixture = 'gameIds';

          gameSpecFindQuerySortOptionFixture =
            GameSpecFindQuerySortOption.gameIds;

          requestServiceMock.tryParseStringQuery
            .mockReturnValueOnce({
              isRight: true,
              value: gameIdsFixture,
            })
            .mockReturnValueOnce({
              isRight: true,
              value: sortOptionV1Fixture,
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

          gameSpecFindQuerySortOptionFromGameSpecSortOptionV1BuilderMock.build.mockReturnValueOnce(
            gameSpecFindQuerySortOptionFixture,
          );

          gameSpecSortOptionValidatorMock.validate.mockReturnValueOnce(true);

          result =
            await getGamesV1SpecsRequestParamHandler.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameSpecSortOptionValidator.validate()', () => {
          expect(
            gameSpecSortOptionValidatorMock.validate,
          ).toHaveBeenCalledTimes(1);
          expect(gameSpecSortOptionValidatorMock.validate).toHaveBeenCalledWith(
            sortOptionV1Fixture,
          );
        });

        it('should call gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder.build()', () => {
          expect(
            gameSpecFindQuerySortOptionFromGameSpecSortOptionV1BuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameSpecFindQuerySortOptionFromGameSpecSortOptionV1BuilderMock.build,
          ).toHaveBeenCalledWith(sortOptionV1Fixture);
        });

        it('should return [GameSpecFindQuery] with an array with gameId', () => {
          const expectedGameSpecFindQuery: GameSpecFindQuery = {
            gameIds: gameIdsFixture,
            limit: 10,
            offset: 0,
            sort: gameSpecFindQuerySortOptionFixture,
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

          requestServiceMock.tryParseStringQuery
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
              jwtPayload: {
                [Symbol()]: Symbol(),
              },
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

          requestServiceMock.tryParseStringQuery
            .mockReturnValueOnce({
              isRight: true,
              value: gameIdsFixture,
            })
            .mockReturnValueOnce({
              isRight: false,
              value: {
                errors: [],
                kind: RequestQueryParseFailureKind.notFound,
              },
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
