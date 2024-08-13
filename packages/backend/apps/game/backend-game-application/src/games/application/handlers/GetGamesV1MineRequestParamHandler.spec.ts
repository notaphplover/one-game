import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  AppError,
  AppErrorKind,
  Builder,
  Left,
} from '@cornie-js/backend-common';
import {
  GameFindQuery,
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
  UserAuth,
} from '@cornie-js/backend-http';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GetGamesV1MineRequestParamHandler } from './GetGamesV1MineRequestParamHandler';

describe(GetGamesV1MineRequestParamHandler.name, () => {
  let gameStatusFromGameV1StatusBuilderMock: jest.Mocked<
    Builder<GameStatus, [string]>
  >;
  let requestServiceMock: jest.Mocked<RequestService>;

  let getGameV1MineRequestParamHandler: GetGamesV1MineRequestParamHandler;

  beforeAll(() => {
    gameStatusFromGameV1StatusBuilderMock = {
      build: jest.fn(),
    };
    requestServiceMock = {
      composeErrorMessages: jest.fn(),
      tryParseIntegerQuery: jest.fn(),
      tryParseStringQuery: jest.fn(),
    } as Partial<jest.Mocked<RequestService>> as jest.Mocked<RequestService>;

    getGameV1MineRequestParamHandler = new GetGamesV1MineRequestParamHandler(
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
          await getGameV1MineRequestParamHandler.handle(requestFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call requestService.tryParseIntegerQuery()', () => {
        const firstCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetGamesV1MineRequestParamHandler.pageQueryParam,
        };
        const secondCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetGamesV1MineRequestParamHandler.pageSizeQueryParam,
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
          [failureFixture, GetGamesV1MineRequestParamHandler.pageQueryParam],
          [
            failureFixture,
            GetGamesV1MineRequestParamHandler.pageSizeQueryParam,
          ],
          [failureFixture, GetGamesV1MineRequestParamHandler.statusQueryParam],
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

    describe('when called, and requestService returns query values', () => {
      let pageFixture: number;
      let pageSizeFixture: number;
      let gameStatusV1Fixture: string;
      let gameStatusFixture: GameStatus;

      let result: unknown;

      beforeAll(async () => {
        pageFixture = 2;
        pageSizeFixture = 10;
        gameStatusV1Fixture = 'active';
        gameStatusFixture = GameStatus.active;

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

        result = await getGameV1MineRequestParamHandler.handle(requestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call requestService.tryParseIntegerQuery()', () => {
        const firstCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetGamesV1MineRequestParamHandler.pageQueryParam,
        };
        const secondCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetGamesV1MineRequestParamHandler.pageSizeQueryParam,
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

      it('should return a [GameFindQuery]', () => {
        const expected: GameFindQuery = {
          gameSlotFindQuery: {
            userId: (requestFixture[requestContextProperty].auth as UserAuth)
              .user.id,
          },
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

      let result: unknown;

      beforeAll(async () => {
        appErrorMessageFixture = 'app-error-message-fixture';
        errorFixture = 'error-fixture';
        pageFixture = 2;
        pageSizeFixture = 10;
        gameStatusFixture = 'invalid-game-status-fixture';

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
          await getGameV1MineRequestParamHandler.handle(requestFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call requestService.tryParseIntegerQuery()', () => {
        const firstCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetGamesV1MineRequestParamHandler.pageQueryParam,
        };
        const secondCallExpectedProperties: Partial<
          NumericRequestQueryParseOptions<false>
        > = {
          name: GetGamesV1MineRequestParamHandler.pageSizeQueryParam,
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
              value: pageFixture,
            },
            GetGamesV1MineRequestParamHandler.pageQueryParam,
          ],
          [
            {
              isRight: true,
              value: pageSizeFixture,
            },
            GetGamesV1MineRequestParamHandler.pageSizeQueryParam,
          ],
          [
            {
              isRight: false,
              value: {
                errors: [appErrorMessageFixture],
                kind: RequestQueryParseFailureKind.invalidValue,
              },
            },
            GetGamesV1MineRequestParamHandler.statusQueryParam,
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
