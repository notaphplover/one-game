import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameStatus,
} from '@cornie-js/backend-game-domain/games';
import {
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
} from '@cornie-js/backend-http';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GetGameV1MineRequestParamHandler } from './GetGameV1MineRequestParamHandler';

describe(GetGameV1MineRequestParamHandler.name, () => {
  let getGameV1MineRequestParamHandler: GetGameV1MineRequestParamHandler;

  beforeAll(() => {
    getGameV1MineRequestParamHandler = new GetGameV1MineRequestParamHandler();
  });

  describe('.handle', () => {
    describe.each<
      [string, Request & AuthRequestContextHolder, Partial<AppError>]
    >([
      [
        'with page below minimum value',
        {
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
        },
        {
          kind: AppErrorKind.contractViolation,
          message: `Expecting "${GetGameV1MineRequestParamHandler.pageQueryParam}" query to be at least 1`,
        },
      ],
      [
        'with page size below minimum value',
        {
          headers: {},
          query: {
            [GetGameV1MineRequestParamHandler.pageSizeQueryParam]: '0',
          },
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        },
        {
          kind: AppErrorKind.contractViolation,
          message: `Expecting "${GetGameV1MineRequestParamHandler.pageSizeQueryParam}" query to be at least 1`,
        },
      ],
      [
        'with page size above maximum value',
        {
          headers: {},
          query: {
            [GetGameV1MineRequestParamHandler.pageSizeQueryParam]: '51',
          },
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        },
        {
          kind: AppErrorKind.contractViolation,
          message: `Expecting "${GetGameV1MineRequestParamHandler.pageSizeQueryParam}" query to be at most 50`,
        },
      ],
      [
        'with invalid status',
        {
          headers: {},
          query: {
            [GetGameV1MineRequestParamHandler.statusQueryParam]: 'qwerty',
          },
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        },
        {
          kind: AppErrorKind.contractViolation,
          message: expect.stringContaining(
            `Expected "${GetGameV1MineRequestParamHandler.statusQueryParam}" query to be one of the following values:`,
          ) as unknown as string,
        },
      ],
      [
        'with no user auth',
        {
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.backendService,
            },
          },
          urlParameters: {},
        },
        {
          kind: AppErrorKind.unprocessableOperation,
          message: 'Unnable to retrieve user from non user credentials',
        },
      ],
    ])(
      'having a request %s',
      (
        _: string,
        requestFixture: Request & AuthRequestContextHolder,
        expectedErrorProperties: Partial<AppError>,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(async () => {
            try {
              await getGameV1MineRequestParamHandler.handle(requestFixture);
            } catch (error: unknown) {
              result = error;
            }
          });

          it('should throw an Error', () => {
            expect(result).toBeInstanceOf(AppError);
            expect(result).toStrictEqual(
              expect.objectContaining(expectedErrorProperties),
            );
          });
        });
      },
    );

    describe.each<[string, Request & AuthRequestContextHolder, GameFindQuery]>([
      [
        'with no query params',
        {
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        },
        {
          gameSlotFindQuery: {
            userId: UserV1Fixtures.any.id,
          },
          limit: 10,
          offset: 0,
        },
      ],
      [
        'with page params',
        {
          headers: {},
          query: {
            [GetGameV1MineRequestParamHandler.pageQueryParam]: '4',
          },
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        },
        {
          gameSlotFindQuery: {
            userId: UserV1Fixtures.any.id,
          },
          limit: 10,
          offset: 30,
        },
      ],
      [
        'with page size params',
        {
          headers: {},
          query: {
            [GetGameV1MineRequestParamHandler.pageSizeQueryParam]: '20',
          },
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        },
        {
          gameSlotFindQuery: {
            userId: UserV1Fixtures.any.id,
          },
          limit: 20,
          offset: 0,
        },
      ],
      [
        'with status active params',
        {
          headers: {},
          query: {
            [GetGameV1MineRequestParamHandler.statusQueryParam]: 'active',
          },
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        },
        {
          gameSlotFindQuery: {
            userId: UserV1Fixtures.any.id,
          },
          limit: 10,
          offset: 0,
          status: GameStatus.active,
        },
      ],
      [
        'with status nonStarted params',
        {
          headers: {},
          query: {
            [GetGameV1MineRequestParamHandler.statusQueryParam]: 'nonStarted',
          },
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: UserV1Fixtures.any,
            },
          },
          urlParameters: {},
        },
        {
          gameSlotFindQuery: {
            userId: UserV1Fixtures.any.id,
          },
          limit: 10,
          offset: 0,
          status: GameStatus.nonStarted,
        },
      ],
    ])(
      'having a request %s',
      (
        _: string,
        requestFixture: Request & AuthRequestContextHolder,
        expectedGameFindQuery: GameFindQuery,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(async () => {
            result =
              await getGameV1MineRequestParamHandler.handle(requestFixture);
          });

          it('should return a [GameFindQuery]', () => {
            expect(result).toStrictEqual([expectedGameFindQuery]);
          });
        });
      },
    );
  });
});
