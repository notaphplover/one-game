import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Left } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameStatus,
} from '@cornie-js/backend-game-domain/games';
import {
  AuthKind,
  AuthRequestContextHolder,
  Request,
  RequestQueryParseFailure,
  RequestQueryParseFailureKind,
  RequestService,
  UserAuth,
  requestContextProperty,
} from '@cornie-js/backend-http';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GetGameV1MineRequestParamHandler } from './GetGameV1MineRequestParamHandler';

describe(GetGameV1MineRequestParamHandler.name, () => {
  let requestServiceMock: jest.Mocked<RequestService>;

  let getGameV1MineRequestParamHandler: GetGameV1MineRequestParamHandler;

  beforeAll(() => {
    requestServiceMock = {
      composeErrorMessages: jest.fn(),
      tryParseIntegerQuery: jest.fn(),
      tryParseStringQuery: jest.fn(),
    } as Partial<jest.Mocked<RequestService>> as jest.Mocked<RequestService>;

    getGameV1MineRequestParamHandler = new GetGameV1MineRequestParamHandler(
      requestServiceMock,
    );
  });

  describe('.handle', () => {
    let requestFixture: Request & AuthRequestContextHolder;

    beforeAll(() => {
      requestFixture = {
        headers: {},
        query: {
          [GetGameV1MineRequestParamHandler.pageQueryParam]: '0',
        },
        [requestContextProperty]: {
          auth: {
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
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenCalledTimes(
          2,
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          1,
          requestFixture,
          expect.any(Object),
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          2,
          requestFixture,
          expect.any(Object),
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
          [failureFixture, GetGameV1MineRequestParamHandler.pageQueryParam],
          [failureFixture, GetGameV1MineRequestParamHandler.pageSizeQueryParam],
          [failureFixture, GetGameV1MineRequestParamHandler.statusQueryParam],
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
      let gameStatusFixture: string;

      let result: unknown;

      beforeAll(async () => {
        pageFixture = 2;
        pageSizeFixture = 10;
        gameStatusFixture = 'active';

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

        result = await getGameV1MineRequestParamHandler.handle(requestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call requestService.tryParseIntegerQuery()', () => {
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenCalledTimes(
          2,
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          1,
          requestFixture,
          expect.any(Object),
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          2,
          requestFixture,
          expect.any(Object),
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
          status: GameStatus.active,
        };

        expect(result).toStrictEqual([expected]);
      });
    });

    describe('when called, and requestService returns invalid game status', () => {
      let pageFixture: number;
      let pageSizeFixture: number;
      let gameStatusFixture: string;

      let result: unknown;

      beforeAll(async () => {
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
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenCalledTimes(
          2,
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          1,
          requestFixture,
          expect.any(Object),
        );
        expect(requestServiceMock.tryParseIntegerQuery).toHaveBeenNthCalledWith(
          2,
          requestFixture,
          expect.any(Object),
        );
      });

      it('should call requestService.tryParseStringQuery()', () => {
        expect(requestServiceMock.tryParseStringQuery).toHaveBeenCalledTimes(1);
        expect(requestServiceMock.tryParseStringQuery).toHaveBeenCalledWith(
          requestFixture,
          expect.any(Object),
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.contractViolation,
          message: expect.stringContaining(
            'query to be one of the following values',
          ) as unknown as string,
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
