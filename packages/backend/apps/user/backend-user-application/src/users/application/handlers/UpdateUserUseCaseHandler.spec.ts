import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  AppError,
  AppErrorKind,
  Handler,
  ReportBasedSpec,
} from '@cornie-js/backend-common';
import { User, UserUpdateQuery } from '@cornie-js/backend-user-domain/users';
import {
  UserFixtures,
  UserUpdateQueryFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UserUpdatedEvent } from '../models/UserUpdatedEvent';
import { UserPersistenceOutputPort } from '../ports/output/UserPersistenceOutputPort';
import { UpdateUserUseCaseHandler } from './UpdateUserUseCaseHandler';

describe(UpdateUserUseCaseHandler.name, () => {
  let isValidUserUpdateQuerySpecMock: jest.Mocked<
    ReportBasedSpec<[UserUpdateQuery], string[]>
  >;
  let userUpdatedEventHandlerMock: jest.Mocked<
    Handler<[UserUpdatedEvent], void>
  >;

  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;

  let updateUserUseCaseHandler: UpdateUserUseCaseHandler;

  beforeAll(() => {
    isValidUserUpdateQuerySpecMock = {
      isSatisfiedOrReport: jest.fn(),
    };
    userUpdatedEventHandlerMock = {
      handle: jest.fn(),
    };
    userPersistenceOutputPortMock = {
      create: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    updateUserUseCaseHandler = new UpdateUserUseCaseHandler(
      isValidUserUpdateQuerySpecMock,
      userUpdatedEventHandlerMock,
      userPersistenceOutputPortMock,
    );
  });

  describe('.handle()', () => {
    let userUpdateQueryFixture: UserUpdateQuery;

    beforeAll(() => {
      userUpdateQueryFixture = UserUpdateQueryFixtures.any;
    });

    describe('when called, and isValidUserUpdateQuerySpec.isSatisfiedOrReport() returns Left', () => {
      let result: unknown;

      beforeAll(async () => {
        isValidUserUpdateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce({
          isRight: false,
          value: [],
        });

        try {
          await updateUserUseCaseHandler.handle(userUpdateQueryFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call isValidUserUpdateQuerySpec.isSatisfiedOrReport()', () => {
        expect(
          isValidUserUpdateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledTimes(1);
        expect(
          isValidUserUpdateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledWith(userUpdateQueryFixture);
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: expect.stringContaining(
            'Invalid user update request. Reasons',
          ) as unknown as string,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and isValidUserUpdateQuerySpec.isSatisfiedOrReport() returns Right and userPersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        isValidUserUpdateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce({
          isRight: true,
          value: undefined,
        });

        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

        try {
          await updateUserUseCaseHandler.handle(userUpdateQueryFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call isValidUserUpdateQuerySpec.isSatisfiedOrReport()', () => {
        expect(
          isValidUserUpdateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledTimes(1);
        expect(
          isValidUserUpdateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledWith(userUpdateQueryFixture);
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          userUpdateQueryFixture.userFindQuery,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.entityNotFound,
          message: 'Unable to fetch user to update',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and isValidUserUpdateQuerySpec.isSatisfiedOrReport() returns Right and userPersistenceOutputPort.findOne() returns User', () => {
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;

        isValidUserUpdateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce({
          isRight: true,
          value: undefined,
        });

        userPersistenceOutputPortMock.findOne
          .mockResolvedValueOnce(userFixture)
          .mockResolvedValueOnce(userFixture);

        userPersistenceOutputPortMock.update.mockResolvedValueOnce(undefined);
        userUpdatedEventHandlerMock.handle.mockResolvedValueOnce(undefined);

        result = await updateUserUseCaseHandler.handle(userUpdateQueryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call isValidUserUpdateQuerySpec.isSatisfiedOrReport()', () => {
        expect(
          isValidUserUpdateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledTimes(1);
        expect(
          isValidUserUpdateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledWith(userUpdateQueryFixture);
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(2);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenNthCalledWith(
          1,
          userUpdateQueryFixture.userFindQuery,
        );
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenNthCalledWith(
          2,
          userUpdateQueryFixture.userFindQuery,
        );
      });

      it('should call userPersistenceOutputPort.update()', () => {
        expect(userPersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.update).toHaveBeenCalledWith(
          userUpdateQueryFixture,
        );
      });

      it('should call userUpdatedEventHandler.handle()', () => {
        const expectedUserUpdatedEvent: UserUpdatedEvent = {
          userBeforeUpdate: userFixture,
          userUpdateQuery: userUpdateQueryFixture,
        };

        expect(userUpdatedEventHandlerMock.handle).toHaveBeenCalledTimes(1);
        expect(userUpdatedEventHandlerMock.handle).toHaveBeenCalledWith(
          expectedUserUpdatedEvent,
        );
      });

      it('should return a User', () => {
        expect(result).toBe(userFixture);
      });
    });
  });
});
