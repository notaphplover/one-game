import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { Request, RequestWithBody } from '@cornie-js/backend-http';
import {
  User,
  UserCodeKind,
  UserFindQuery,
} from '@cornie-js/backend-user-domain/users';
import { UserFixtures } from '@cornie-js/backend-user-domain/users/fixtures';

import { UserPersistenceOutputPort } from '../ports/output/UserPersistenceOutputPort';
import { BaseUserV1EmailCodeRequestParamHandler } from './BaseUserV1EmailCodeRequestParamHandler';
import { PostUserV1EmailCodeRequestParamHandler } from './PostUserV1EmailCodeRequestParamHandler';

describe(PostUserV1EmailCodeRequestParamHandler.name, () => {
  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;
  let postUserV1EmailCodeRequestBodyParamHandlerMock: jest.Mocked<
    Handler<[RequestWithBody], [apiModels.UserCodeCreateQueryV1]>
  >;
  let userCodeKindFromUserCodeKindV1BuilderMock: jest.Mocked<
    Builder<UserCodeKind, [apiModels.UserCodeKindV1]>
  >;

  let postUserV1EmailCodeRequestParamHandler: PostUserV1EmailCodeRequestParamHandler;

  beforeAll(() => {
    userPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserPersistenceOutputPort>
    > as jest.Mocked<UserPersistenceOutputPort>;

    postUserV1EmailCodeRequestBodyParamHandlerMock = {
      handle: jest.fn(),
    };

    userCodeKindFromUserCodeKindV1BuilderMock = {
      build: jest.fn(),
    };

    postUserV1EmailCodeRequestParamHandler =
      new PostUserV1EmailCodeRequestParamHandler(
        userPersistenceOutputPortMock,
        postUserV1EmailCodeRequestBodyParamHandlerMock,
        userCodeKindFromUserCodeKindV1BuilderMock,
      );
  });

  describe('.handle', () => {
    describe('having a Request with no email url parameter', () => {
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
            await postUserV1EmailCodeRequestParamHandler.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: `Unexpected missing "${BaseUserV1EmailCodeRequestParamHandler.emailUrlParameter}" url parameter`,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having a Request with email url parameter', () => {
      let emailFixture: string;
      let requestFixture: Request;

      beforeAll(() => {
        emailFixture = 'mail@example.com';

        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {
            [BaseUserV1EmailCodeRequestParamHandler.emailUrlParameter]:
              emailFixture,
          },
        };
      });

      describe('when called, and userPersistenceOutputPort.findOne() returns undefined', () => {
        let result: unknown;

        beforeAll(async () => {
          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await postUserV1EmailCodeRequestParamHandler.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userPersistenceOutputPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            email: emailFixture,
          };

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.entityNotFound,
            message: 'User not found',
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });

      describe('when called, and userPersistenceOutputPort.findOne() returns User', () => {
        let userFixture: User;

        let result: unknown;

        beforeAll(async () => {
          userFixture = UserFixtures.any;

          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );

          result =
            await postUserV1EmailCodeRequestParamHandler.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userPersistenceOutputPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            email: emailFixture,
          };

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should return an array with a User and UserCodeKind', () => {
          const expectedUserCodeKind: UserCodeKind =
            UserCodeKind.registerConfirm;

          expect(result).toStrictEqual([userFixture, expectedUserCodeKind]);
        });
      });
    });

    describe('having a Request with body with email url parameter', () => {
      let emailFixture: string;
      let requestFixture: RequestWithBody;

      beforeAll(() => {
        emailFixture = 'mail@example.com';

        requestFixture = {
          body: {
            foo: 'bar',
          },
          headers: {},
          query: {},
          urlParameters: {
            [BaseUserV1EmailCodeRequestParamHandler.emailUrlParameter]:
              emailFixture,
          },
        };
      });

      describe('when called, and userPersistenceOutputPort.findOne() returns User', () => {
        let userCodeCreateQueryV1Fixture: apiModels.UserCodeCreateQueryV1;
        let userFixture: User;
        let userCodeKindFixture: UserCodeKind;

        let result: unknown;

        beforeAll(async () => {
          userCodeCreateQueryV1Fixture = {
            kind: 'resetPassword',
          };
          userFixture = UserFixtures.any;
          userCodeKindFixture = UserCodeKind.resetPassword;

          postUserV1EmailCodeRequestBodyParamHandlerMock.handle.mockResolvedValueOnce(
            [userCodeCreateQueryV1Fixture],
          );

          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );

          userCodeKindFromUserCodeKindV1BuilderMock.build.mockReturnValueOnce(
            userCodeKindFixture,
          );

          result =
            await postUserV1EmailCodeRequestParamHandler.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call postUserV1EmailCodeRequestBodyParamHandler.handle()', () => {
          expect(
            postUserV1EmailCodeRequestBodyParamHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            postUserV1EmailCodeRequestBodyParamHandlerMock.handle,
          ).toHaveBeenCalledWith(requestFixture);
        });

        it('should call userPersistenceOutputPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            email: emailFixture,
          };

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should return an array with a User and UserCodeKind', () => {
          expect(result).toStrictEqual([userFixture, userCodeKindFixture]);
        });
      });
    });
  });
});
