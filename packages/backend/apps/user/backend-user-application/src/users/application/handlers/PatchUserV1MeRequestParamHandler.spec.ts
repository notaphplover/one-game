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

import { UserMeUpdateQueryV1Fixtures } from '../fixtures/UserMeUpdateQueryV1Fixtures';
import { UserV1Fixtures } from '../fixtures/UserV1Fixtures';
import { PatchUserV1MeRequestParamHandler } from './PatchUserV1MeRequestParamHandler';

describe(PatchUserV1MeRequestParamHandler.name, () => {
  let patchUserMeV1RequestBodyParamHandlerMock: jest.Mocked<
    Handler<[RequestWithBody], [apiModels.UserMeUpdateQueryV1]>
  >;

  let patchUserV1MeRequestParamHandler: PatchUserV1MeRequestParamHandler;

  beforeAll(() => {
    patchUserMeV1RequestBodyParamHandlerMock = {
      handle: jest.fn(),
    };

    patchUserV1MeRequestParamHandler = new PatchUserV1MeRequestParamHandler(
      patchUserMeV1RequestBodyParamHandlerMock,
    );
  });

  describe('.handle', () => {
    describe('having a request with backend service context', () => {
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
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await patchUserV1MeRequestParamHandler.handle(requestFixture);
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

    describe('having a request with user auth context', () => {
      let authFixture: UserAuth;
      let requestFixture: RequestWithBody & AuthRequestContextHolder;

      beforeAll(() => {
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
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let userMeUpdateQueryV1Fixture: apiModels.UserMeUpdateQueryV1;

        let result: unknown;

        beforeAll(async () => {
          userMeUpdateQueryV1Fixture = UserMeUpdateQueryV1Fixtures.any;

          patchUserMeV1RequestBodyParamHandlerMock.handle.mockResolvedValueOnce(
            [userMeUpdateQueryV1Fixture],
          );

          result =
            await patchUserV1MeRequestParamHandler.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call patchUserMeV1RequestBodyParamHandler.handle()', () => {
          expect(
            patchUserMeV1RequestBodyParamHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            patchUserMeV1RequestBodyParamHandlerMock.handle,
          ).toHaveBeenCalledWith(requestFixture);
        });

        it('should return request params', () => {
          expect(result).toStrictEqual([
            (requestFixture[requestContextProperty].auth as UserAuth).user,
            userMeUpdateQueryV1Fixture,
          ]);
        });
      });
    });
  });
});
