import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  AppError,
  AppErrorKind,
  Builder,
  Left,
} from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GamesCanBeFoundByUserSpec,
  GameStatus,
} from '@cornie-js/backend-game-domain/games';
import {
  AuthKind,
  AuthRequestContextHolder,
  NumericRequestQueryParseOptions,
  Request,
  requestContextProperty,
  RequestQueryParseFailure,
  RequestQueryParseFailureKind,
  RequestService,
} from '@cornie-js/backend-http';
import { RequestQueryParseOptions } from '@cornie-js/backend-http/lib/http/application/services/RequestService';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GetV1GamesRequestParamHandler } from './GetV1GamesRequestParamHandler';

describe(GetV1GamesRequestParamHandler.name, () => {
  let gamesCanBeFoundByUserSpecMock: jest.Mocked<GamesCanBeFoundByUserSpec>;
  let gameStatusFromGameV1StatusBuilderMock: jest.Mocked<
    Builder<GameStatus, [string]>
  >;
  let requestServiceMock: jest.Mocked<RequestService>;

  let getGamesV1MineRequestParamHandler: GetV1GamesRequestParamHandler;

  beforeAll(() => {
    gamesCanBeFoundByUserSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    gameStatusFromGameV1StatusBuilderMock = {
      build: jest.fn(),
    };
    requestServiceMock = {
      composeErrorMessages: jest.fn(),
      tryParseBooleanQuery: jest.fn(),
      tryParseIntegerQuery: jest.fn(),
      tryParseStringQuery: jest.fn(),
    } as Partial<jest.Mocked<RequestService>> as jest.Mocked<RequestService>;

    getGamesV1MineRequestParamHandler = new GetV1GamesRequestParamHandler(
      gamesCanBeFoundByUserSpecMock,
      gameStatusFromGameV1StatusBuilderMock,
      requestServiceMock,
    );
  });

  describe('.handle', () => {
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

    describe('when called, and requestService returns a failure', () => {
      let errorFixture: string;
      let failureFixture: Left<RequestQueryParseFailure>;

      let result: unknown;

      beforeAll(async () => {
        errorFixture = 'error-fixture';
        failureFixture = {
          isRight: false,
          value: {
            errors: [],
            kind: RequestQueryParseFailureKind.invalidValue,
          },
        };

        requestServiceMock.tryParseBooleanQuery.mockReturnValueOnce(
          failureFixture,
        );
        requestServiceMock.tryParseIntegerQuery
          .mockReturnValueOnce(failureFixture)
          .mockReturnValueOnce(failureFixture);
        requestServiceMock.tryParseStringQuery.mockReturnValueOnce(
          failureFixture,
        );

        requestServiceMock.composeErrorMessages.mockReturnValueOnce([
          errorFixture,
        ]);

        try {
          await getGamesV1MineRequestParamHandler.handle(requestFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call requestService.tryParseBooleanQuery()', () => {
        const expectedOptions: RequestQueryParseOptions<boolean> = {
          isMultiple: false,
          name: GetV1GamesRequestParamHandler.isPublicQueryParam,
        };

        expect(requestServiceMock.tryParseBooleanQuery).toHaveBeenCalledTimes(
          1,
        );
        expect(requestServiceMock.tryParseBooleanQuery).toHaveBeenCalledWith(
          requestFixture,
          expectedOptions,
        );
      });

      it('should call requestService.tryParseIntegerQuery()', () => {
        const firstCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetV1GamesRequestParamHandler.pageQueryParam,
        };
        const secondCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetV1GamesRequestParamHandler.pageSizeQueryParam,
        };

        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenCalledTimes(
          2,
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          1,
          requestFixture,
          expect.objectContaining(firstCallExpectedProperties),
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          2,
          requestFixture,
          expect.objectContaining(secondCallExpectedProperties),
        );
      });

      it('should call requestService.tryParseStringQuery()', () => {
        expect(requestServiceMock.tryParseStringQuery).toHaveBeenCalledTimes(1);
        expect(requestServiceMock.tryParseStringQuery).toHaveBeenCalledWith(
          requestFixture,
          expect.any(Object),
        );
      });

      it('should call requestService.composeErrorMessages()', () => {
        expect(requestServiceMock.composeErrorMessages).toHaveBeenCalledTimes(
          1,
        );
        expect(requestServiceMock.composeErrorMessages).toHaveBeenCalledWith([
          [failureFixture, GetV1GamesRequestParamHandler.isPublicQueryParam],
          [failureFixture, GetV1GamesRequestParamHandler.pageQueryParam],
          [failureFixture, GetV1GamesRequestParamHandler.pageSizeQueryParam],
          [failureFixture, GetV1GamesRequestParamHandler.statusQueryParam],
        ]);
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

    describe('when called, and requestService returns query values, and gamesCanBeFoundByUserSpec.isSatisfiedBy() returns true', () => {
      let pageFixture: number;
      let pageSizeFixture: number;
      let gameStatusV1Fixture: string;
      let gameStatusFixture: GameStatus;
      let isPublicFixture: boolean;

      let result: unknown;

      beforeAll(async () => {
        pageFixture = 2;
        pageSizeFixture = 10;
        gameStatusV1Fixture = 'active';
        gameStatusFixture = GameStatus.active;
        isPublicFixture = true;

        requestServiceMock.tryParseBooleanQuery.mockReturnValueOnce({
          isRight: true,
          value: isPublicFixture,
        });
        requestServiceMock.tryParseIntegerQuery
          .mockReturnValueOnce({
            isRight: true,
            value: pageFixture,
          })
          .mockReturnValueOnce({ isRight: true, value: pageSizeFixture });
        requestServiceMock.tryParseStringQuery.mockReturnValueOnce({
          isRight: true,
          value: gameStatusV1Fixture,
        });

        gameStatusFromGameV1StatusBuilderMock.build.mockReturnValueOnce(
          gameStatusFixture,
        );

        gamesCanBeFoundByUserSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        result = await getGamesV1MineRequestParamHandler.handle(requestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call requestService.tryParseBooleanQuery()', () => {
        const expectedOptions: RequestQueryParseOptions<boolean> = {
          isMultiple: false,
          name: GetV1GamesRequestParamHandler.isPublicQueryParam,
        };

        expect(requestServiceMock.tryParseBooleanQuery).toHaveBeenCalledTimes(
          1,
        );
        expect(requestServiceMock.tryParseBooleanQuery).toHaveBeenCalledWith(
          requestFixture,
          expectedOptions,
        );
      });

      it('should call requestService.tryParseIntegerQuery()', () => {
        const firstCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetV1GamesRequestParamHandler.pageQueryParam,
        };
        const secondCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetV1GamesRequestParamHandler.pageSizeQueryParam,
        };

        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenCalledTimes(
          2,
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          1,
          requestFixture,
          expect.objectContaining(firstCallExpectedProperties),
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          2,
          requestFixture,
          expect.objectContaining(secondCallExpectedProperties),
        );
      });

      it('should call requestService.tryParseStringQuery()', () => {
        expect(requestServiceMock.tryParseStringQuery).toHaveBeenCalledTimes(1);
        expect(requestServiceMock.tryParseStringQuery).toHaveBeenCalledWith(
          requestFixture,
          expect.any(Object),
        );
      });

      it('should call gamesCanBeFoundByUserSpec.isSatisfiedBy()', () => {
        const expected: GameFindQuery = {
          isPublic: isPublicFixture,
          limit: pageSizeFixture,
          offset: (pageFixture - 1) * pageSizeFixture,
          status: gameStatusFixture,
        };

        expect(
          gamesCanBeFoundByUserSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gamesCanBeFoundByUserSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(expected);
      });

      it('should return a [GameFindQuery]', () => {
        const expected: GameFindQuery = {
          isPublic: isPublicFixture,
          limit: pageSizeFixture,
          offset: (pageFixture - 1) * pageSizeFixture,
          status: gameStatusFixture,
        };

        expect(result).toStrictEqual([expected]);
      });
    });

    describe('when called, and gameStatusFromGameV1StatusBuilderMock.build() throws an AppError of kind contractViolation', () => {
      let appErrorMessageFixture: string;
      let errorFixture: string;
      let pageFixture: number;
      let pageSizeFixture: number;
      let gameStatusFixture: string;
      let isPublicFixture: boolean;

      let result: unknown;

      beforeAll(async () => {
        appErrorMessageFixture = 'app-error-message-fixture';
        errorFixture = 'error-fixture';
        pageFixture = 2;
        pageSizeFixture = 10;
        gameStatusFixture = 'invalid-game-status-fixture';
        isPublicFixture = true;

        requestServiceMock.tryParseBooleanQuery.mockReturnValueOnce({
          isRight: true,
          value: isPublicFixture,
        });
        requestServiceMock.tryParseIntegerQuery
          .mockReturnValueOnce({
            isRight: true,
            value: pageFixture,
          })
          .mockReturnValueOnce({ isRight: true, value: pageSizeFixture });
        requestServiceMock.tryParseStringQuery.mockReturnValueOnce({
          isRight: true,
          value: gameStatusFixture,
        });

        gameStatusFromGameV1StatusBuilderMock.build.mockImplementationOnce(
          () => {
            throw new AppError(
              AppErrorKind.contractViolation,
              appErrorMessageFixture,
            );
          },
        );

        requestServiceMock.composeErrorMessages.mockReturnValueOnce([
          errorFixture,
        ]);

        try {
          await getGamesV1MineRequestParamHandler.handle(requestFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call requestService.tryParseBooleanQuery()', () => {
        const expectedOptions: RequestQueryParseOptions<boolean> = {
          isMultiple: false,
          name: GetV1GamesRequestParamHandler.isPublicQueryParam,
        };

        expect(requestServiceMock.tryParseBooleanQuery).toHaveBeenCalledTimes(
          1,
        );
        expect(requestServiceMock.tryParseBooleanQuery).toHaveBeenCalledWith(
          requestFixture,
          expectedOptions,
        );
      });

      it('should call requestService.tryParseIntegerQuery()', () => {
        const firstCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetV1GamesRequestParamHandler.pageQueryParam,
        };
        const secondCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetV1GamesRequestParamHandler.pageSizeQueryParam,
        };

        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenCalledTimes(
          2,
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          1,
          requestFixture,
          expect.objectContaining(firstCallExpectedProperties),
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          2,
          requestFixture,
          expect.objectContaining(secondCallExpectedProperties),
        );
      });

      it('should call requestService.tryParseStringQuery()', () => {
        expect(requestServiceMock.tryParseStringQuery).toHaveBeenCalledTimes(1);
        expect(requestServiceMock.tryParseStringQuery).toHaveBeenCalledWith(
          requestFixture,
          expect.any(Object),
        );
      });

      it('should call requestService.composeErrorMessages()', () => {
        expect(requestServiceMock.composeErrorMessages).toHaveBeenCalledTimes(
          1,
        );
        expect(requestServiceMock.composeErrorMessages).toHaveBeenCalledWith([
          [
            {
              isRight: true,
              value: isPublicFixture,
            },
            GetV1GamesRequestParamHandler.isPublicQueryParam,
          ],
          [
            {
              isRight: true,
              value: pageFixture,
            },
            GetV1GamesRequestParamHandler.pageQueryParam,
          ],
          [
            {
              isRight: true,
              value: pageSizeFixture,
            },
            GetV1GamesRequestParamHandler.pageSizeQueryParam,
          ],
          [
            {
              isRight: false,
              value: {
                errors: [appErrorMessageFixture],
                kind: RequestQueryParseFailureKind.invalidValue,
              },
            },
            GetV1GamesRequestParamHandler.statusQueryParam,
          ],
        ]);
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
});
