import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  AppError,
  AppErrorKind,
  Handler,
  ReportBasedSpec,
} from '@cornie-js/backend-common';
import { User, UserCreateQuery } from '@cornie-js/backend-user-domain/users';
import {
  UserCreateQueryFixtures,
  UserFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UserCreatedEvent } from '../models/UserCreatedEvent';
import { UserPersistenceOutputPort } from '../ports/output/UserPersistenceOutputPort';
import { CreateUserUseCaseHandler } from './CreateUserUseCaseHandler';

describe(CreateUserUseCaseHandler.name, () => {
  let isValidUserCreateQuerySpecMock: jest.Mocked<
    ReportBasedSpec<[UserCreateQuery], string[]>
  >;
  let userCreatedEventHandlerMock: jest.Mocked<
    Handler<[UserCreatedEvent], void>
  >;

  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;

  let createUserUseCaseHandler: CreateUserUseCaseHandler;

  beforeAll(() => {
    isValidUserCreateQuerySpecMock = {
      isSatisfiedOrReport: jest.fn(),
    };
    userCreatedEventHandlerMock = {
      handle: jest.fn(),
    };
    userPersistenceOutputPortMock = {
      create: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    createUserUseCaseHandler = new CreateUserUseCaseHandler(
      isValidUserCreateQuerySpecMock,
      userCreatedEventHandlerMock,
      userPersistenceOutputPortMock,
    );
  });

  describe('.handle', () => {
    let userCreateQueryFixture: UserCreateQuery;

    beforeAll(() => {
      userCreateQueryFixture = UserCreateQueryFixtures.any;
    });

    describe('when called, and isValidUserCreateQuerySpecMock.isSatisfiedOrReport() returns Left', () => {
      let errorsFixture: string[];

      let result: unknown;

      beforeAll(async () => {
        try {
          errorsFixture = [];

          isValidUserCreateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce(
            {
              isRight: false,
              value: errorsFixture,
            },
          );

          await createUserUseCaseHandler.handle(userCreateQueryFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call isValidUserCreateQuerySpec.isSatisfiedOrReport()', () => {
        expect(
          isValidUserCreateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledTimes(1);
        expect(
          isValidUserCreateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledWith(userCreateQueryFixture);
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: expect.stringContaining(
            'Invalid user create request.',
          ) as unknown as string,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and isValidUserCreateQuerySpecMock.isSatisfiedOrReport() returns Right', () => {
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;
        isValidUserCreateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce({
          isRight: true,
          value: undefined,
        });
        userPersistenceOutputPortMock.create.mockResolvedValueOnce(userFixture);
        userCreatedEventHandlerMock.handle.mockResolvedValueOnce(undefined);

        result = await createUserUseCaseHandler.handle(userCreateQueryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call isValidUserCreateQuerySpec.isSatisfiedOrReport()', () => {
        expect(
          isValidUserCreateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledTimes(1);
        expect(
          isValidUserCreateQuerySpecMock.isSatisfiedOrReport,
        ).toHaveBeenCalledWith(userCreateQueryFixture);
      });

      it('should call userPersistenceOutputPort.create()', () => {
        expect(userPersistenceOutputPortMock.create).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.create).toHaveBeenCalledWith(
          userCreateQueryFixture,
        );
      });

      it('should call userCreatedEventHandler.handle()', () => {
        const expectedUserCreatedEvent: UserCreatedEvent = {
          user: userFixture,
          userCreateQuery: userCreateQueryFixture,
        };

        expect(userCreatedEventHandlerMock.handle).toHaveBeenCalledTimes(1);
        expect(userCreatedEventHandlerMock.handle).toHaveBeenCalledWith(
          expectedUserCreatedEvent,
        );
      });

      it('should return an UserV1', () => {
        expect(result).toBe(userFixture);
      });
    });
  });
});
