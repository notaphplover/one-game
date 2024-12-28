import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import {
  ApiJsonSchemasValidationProvider,
  Validator,
} from '@cornie-js/backend-api-validators';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
  RequestQueryParseFailureKind,
  RequestService,
} from '@cornie-js/backend-http';
import {
  UserFindQuery,
  UserFindQuerySortOption,
} from '@cornie-js/backend-user-domain/users';

import { UserV1Fixtures } from '../fixtures/UserV1Fixtures';
import { GetV1UsersRequestParamHandler } from './GetV1UsersRequestParamHandler';

describe(GetV1UsersRequestParamHandler.name, () => {
  let apiJsonSchemasValidationProviderMock: jest.Mocked<ApiJsonSchemasValidationProvider>;
  let userSpecFindQuerySortOptionFromUserSortOptionV1BuilderMock: jest.Mocked<
    Builder<UserFindQuerySortOption, [apiModels.UserSortOptionV1]>
  >;
  let userSpecSortOptionValidatorMock: jest.Mocked<
    Validator<apiModels.UserSortOptionV1>
  >;
  let requestServiceMock: jest.Mocked<RequestService>;

  let getGamesV1SpecsRequestParamHandler: GetV1UsersRequestParamHandler;

  beforeAll(() => {
    requestServiceMock = {
      composeErrorMessages: jest.fn(),
      tryParseIntegerQuery: jest.fn(),
      tryParseStringQuery: jest.fn(),
    } as Partial<jest.Mocked<RequestService>> as jest.Mocked<RequestService>;

    userSpecSortOptionValidatorMock = {
      validate: jest.fn() as unknown,
    } as Partial<
      jest.Mocked<Validator<apiModels.UserSortOptionV1>>
    > as jest.Mocked<Validator<apiModels.UserSortOptionV1>>;

    apiJsonSchemasValidationProviderMock = {
      provide: jest.fn().mockReturnValueOnce(userSpecSortOptionValidatorMock),
    } as Partial<
      jest.Mocked<ApiJsonSchemasValidationProvider>
    > as jest.Mocked<ApiJsonSchemasValidationProvider>;

    userSpecFindQuerySortOptionFromUserSortOptionV1BuilderMock = {
      build: jest.fn(),
    };

    getGamesV1SpecsRequestParamHandler = new GetV1UsersRequestParamHandler(
      apiJsonSchemasValidationProviderMock,
      userSpecFindQuerySortOptionFromUserSortOptionV1BuilderMock,
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

      describe('when called, and requestService returns ids, page pageSize and sort', () => {
        let idsFixture: string[];
        let pageFixture: number;
        let pageSizeFixture: number;
        let sortOptionV1Fixture: apiModels.UserSortOptionV1;

        let userFindQuerySortOptionFixture: UserFindQuerySortOption;

        let result: unknown;

        beforeAll(async () => {
          pageFixture = 1;
          pageSizeFixture = 10;
          idsFixture = ['id-fixture'];
          sortOptionV1Fixture = 'ids';

          userFindQuerySortOptionFixture = UserFindQuerySortOption.ids;

          requestServiceMock.tryParseStringQuery
            .mockReturnValueOnce({
              isRight: true,
              value: idsFixture,
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

          userSpecFindQuerySortOptionFromUserSortOptionV1BuilderMock.build.mockReturnValueOnce(
            userFindQuerySortOptionFixture,
          );

          userSpecSortOptionValidatorMock.validate.mockReturnValueOnce(true);

          result =
            await getGamesV1SpecsRequestParamHandler.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userSortOptionValidator.validate()', () => {
          expect(
            userSpecSortOptionValidatorMock.validate,
          ).toHaveBeenCalledTimes(1);
          expect(userSpecSortOptionValidatorMock.validate).toHaveBeenCalledWith(
            sortOptionV1Fixture,
          );
        });

        it('should call userFindQuerySortOptionFromUserSortOptionV1Builder.build()', () => {
          expect(
            userSpecFindQuerySortOptionFromUserSortOptionV1BuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            userSpecFindQuerySortOptionFromUserSortOptionV1BuilderMock.build,
          ).toHaveBeenCalledWith(sortOptionV1Fixture);
        });

        it('should return [UserFindQuery] with an array with id', () => {
          const expectedUserFindQuery: UserFindQuery = {
            ids: idsFixture,
            limit: 10,
            offset: 0,
            sort: userFindQuerySortOptionFixture,
          };

          expect(result).toStrictEqual([expectedUserFindQuery]);
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

      describe('when called, and requestService returns no ids, page and pageSize', () => {
        let idsFixture: string[];
        let pageFixture: number;
        let pageSizeFixture: number;

        let result: unknown;

        beforeAll(async () => {
          pageFixture = 1;
          pageSizeFixture = 10;
          idsFixture = [];

          requestServiceMock.tryParseStringQuery
            .mockReturnValueOnce({
              isRight: true,
              value: idsFixture,
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
