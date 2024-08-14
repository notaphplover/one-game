import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { User, UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { UserFixtures } from '@cornie-js/backend-user-domain/users/fixtures';

import { UserPersistenceOutputPort } from '../ports/output/UserPersistenceOutputPort';
import { BaseV1UsersEmailCodeRequestParamHandler } from './BaseV1UsersEmailCodeRequestParamHandler';
import { DeleteV1UsersEmailCodeRequestParamHandler } from './DeleteV1UsersEmailCodeRequestParamHandler';

describe(DeleteV1UsersEmailCodeRequestParamHandler.name, () => {
  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;

  let deleteUserV1EmailCodeRequestParamHandler: DeleteV1UsersEmailCodeRequestParamHandler;

  beforeAll(() => {
    userPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserPersistenceOutputPort>
    > as jest.Mocked<UserPersistenceOutputPort>;

    deleteUserV1EmailCodeRequestParamHandler =
      new DeleteV1UsersEmailCodeRequestParamHandler(
        userPersistenceOutputPortMock,
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
            await deleteUserV1EmailCodeRequestParamHandler.handle(
              requestFixture,
            );
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
            message: `Unexpected missing "${BaseV1UsersEmailCodeRequestParamHandler.emailUrlParameter}" url parameter`,
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
            [BaseV1UsersEmailCodeRequestParamHandler.emailUrlParameter]:
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
            await deleteUserV1EmailCodeRequestParamHandler.handle(
              requestFixture,
            );
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
            await deleteUserV1EmailCodeRequestParamHandler.handle(
              requestFixture,
            );
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

        it('should return an array with a User', () => {
          expect(result).toStrictEqual([userFixture]);
        });
      });
    });
  });
});
