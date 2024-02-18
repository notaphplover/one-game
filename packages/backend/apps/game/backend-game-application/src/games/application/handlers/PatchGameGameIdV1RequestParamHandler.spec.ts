import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  AuthKind,
  AuthRequestContextHolder,
  BackendServiceAuth,
  RequestWithBody,
  UserAuth,
  requestContextProperty,
} from '@cornie-js/backend-http';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { ActiveGameV1Fixtures } from '../fixtures/ActiveGameV1Fixtures';
import { GameIdPlayCardsQueryV1Fixtures } from '../fixtures/GameIdPlayCardsQueryV1Fixtures';
import { PatchGameGameIdV1RequestParamHandler } from './PatchGameGameIdV1RequestParamHandler';

describe(PatchGameGameIdV1RequestParamHandler.name, () => {
  let patchGameGameIdV1RequestBodyParamHandlerMock: jest.Mocked<
    Handler<[RequestWithBody], [apiModels.GameIdUpdateQueryV1]>
  >;

  let patchGameGameIdV1RequestParamHandler: PatchGameGameIdV1RequestParamHandler;

  beforeAll(() => {
    patchGameGameIdV1RequestBodyParamHandlerMock = {
      handle: jest.fn(),
    };

    patchGameGameIdV1RequestParamHandler =
      new PatchGameGameIdV1RequestParamHandler(
        patchGameGameIdV1RequestBodyParamHandlerMock,
      );
  });

  describe('.handle', () => {
    describe('having a request with no game id request param', () => {
      let requestFixture: RequestWithBody;

      beforeAll(() => {
        requestFixture = {
          body: {},
          headers: {},
          query: {},
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await patchGameGameIdV1RequestParamHandler.handle(
              requestFixture as RequestWithBody & AuthRequestContextHolder,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          const errorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Unexpected error: no game id was found in request params',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(errorProperties),
          );
        });
      });
    });

    describe('having a request with game id and  backend service context', () => {
      let authFixture: BackendServiceAuth;
      let requestFixture: RequestWithBody & AuthRequestContextHolder;

      beforeAll(() => {
        authFixture = {
          kind: AuthKind.backendService,
        };

        requestFixture = {
          body: {},
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: authFixture,
          },
          urlParameters: {
            [PatchGameGameIdV1RequestParamHandler.patchGameV1GameIdRequestParam]:
              ActiveGameV1Fixtures.any.id,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await patchGameGameIdV1RequestParamHandler.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          const errorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message: 'Unnable to retrieve user from non user credentials',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(errorProperties),
          );
        });
      });
    });

    describe('having a request with game id and user auth context', () => {
      let gameIdFixture: string;
      let authFixture: UserAuth;
      let requestFixture: RequestWithBody & AuthRequestContextHolder;

      beforeAll(() => {
        gameIdFixture = ActiveGameV1Fixtures.any.id;
        authFixture = {
          jwtPayload: {
            [Symbol()]: Symbol(),
          },
          kind: AuthKind.user,
          user: UserV1Fixtures.any,
        };

        requestFixture = {
          body: {},
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: authFixture,
          },
          urlParameters: {
            [PatchGameGameIdV1RequestParamHandler.patchGameV1GameIdRequestParam]:
              gameIdFixture,
          },
        };
      });

      describe('when called', () => {
        let gameIdUpdateQueryV1Fixture: apiModels.GameIdUpdateQueryV1;

        let result: unknown;

        beforeAll(async () => {
          gameIdUpdateQueryV1Fixture = GameIdPlayCardsQueryV1Fixtures.any;

          patchGameGameIdV1RequestBodyParamHandlerMock.handle.mockResolvedValueOnce(
            [gameIdUpdateQueryV1Fixture],
          );

          result =
            await patchGameGameIdV1RequestParamHandler.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call patchGameGameIdV1RequestBodyParamHandler.handle()', () => {
          expect(
            patchGameGameIdV1RequestBodyParamHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            patchGameGameIdV1RequestBodyParamHandlerMock.handle,
          ).toHaveBeenCalledWith(requestFixture);
        });

        it('should return request params', () => {
          expect(result).toStrictEqual([
            gameIdFixture,
            gameIdUpdateQueryV1Fixture,
            (requestFixture[requestContextProperty].auth as UserAuth).user,
          ]);
        });
      });
    });
  });
});
