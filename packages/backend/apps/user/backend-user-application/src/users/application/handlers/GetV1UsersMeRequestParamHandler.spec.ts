import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  AuthKind,
  AuthRequestContextHolder,
  BackendServiceAuth,
  Request,
  requestContextProperty,
  UserAuth,
} from '@cornie-js/backend-http';

import { UserV1Fixtures } from '../fixtures/UserV1Fixtures';
import { GetV1UsersMeRequestParamHandler } from './GetV1UsersMeRequestParamHandler';

describe(GetV1UsersMeRequestParamHandler.name, () => {
  let getUserV1MeRequestParamHandler: GetV1UsersMeRequestParamHandler;

  beforeAll(() => {
    getUserV1MeRequestParamHandler = new GetV1UsersMeRequestParamHandler();
  });

  describe('.handle', () => {
    describe('having a request with backend service context', () => {
      let authFixture: BackendServiceAuth;
      let requestFixture: Request & AuthRequestContextHolder;

      beforeAll(() => {
        authFixture = {
          kind: AuthKind.backendService,
        };

        requestFixture = {
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
            await getUserV1MeRequestParamHandler.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
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
      let requestFixture: Request & AuthRequestContextHolder;

      beforeAll(() => {
        authFixture = {
          jwtPayload: {
            [Symbol()]: Symbol(),
          },
          kind: AuthKind.user,
          user: UserV1Fixtures.any,
        };

        requestFixture = {
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
          result = await getUserV1MeRequestParamHandler.handle(requestFixture);
        });

        it('should return params', () => {
          expect(result).toStrictEqual([authFixture.user]);
        });
      });
    });
  });
});
