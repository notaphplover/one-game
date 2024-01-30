import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

import { GetUserV1UserIdRequestParamHandler } from './GetUserV1UserIdRequestParamHandler';

describe(GetUserV1UserIdRequestParamHandler.name, () => {
  let getUserV1UserIdRequestParamHandler: GetUserV1UserIdRequestParamHandler;

  beforeAll(() => {
    getUserV1UserIdRequestParamHandler =
      new GetUserV1UserIdRequestParamHandler();
  });

  describe('.handle()', () => {
    describe('having a Request with userId param', () => {
      let userIdFixture: string;
      let requestFixture: Request;

      beforeAll(() => {
        userIdFixture = 'user-id';
        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {
            [GetUserV1UserIdRequestParamHandler.userIdRequestParam]:
              userIdFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result =
            await getUserV1UserIdRequestParamHandler.handle(requestFixture);
        });

        it('should return a string', () => {
          expect(result).toStrictEqual([userIdFixture]);
        });
      });
    });

    describe('having a Request without userId param', () => {
      let requestFixture: Request;

      beforeAll(() => {
        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await getUserV1UserIdRequestParamHandler.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should return a string', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Unexpected error: no user id was found in request params',
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
