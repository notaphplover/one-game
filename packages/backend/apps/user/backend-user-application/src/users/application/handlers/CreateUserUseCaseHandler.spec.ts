/*
 * Ugly workaround until https://github.com/jestjs/jest/issues/14874 is provided in jest@30
 */

const disposeSymbol: unique symbol = Symbol('Symbol.dispose');
const asyncDisposeSymbol: unique symbol = Symbol('Symbol.asyncDispose');

(Symbol as Writable<Partial<SymbolConstructor>>).asyncDispose ??=
  asyncDisposeSymbol as unknown as SymbolConstructor['asyncDispose'];
(Symbol as Writable<Partial<SymbolConstructor>>).dispose ??=
  disposeSymbol as unknown as SymbolConstructor['dispose'];

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  AppError,
  AppErrorKind,
  ReportBasedSpec,
  Writable,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { User, UserCreateQuery } from '@cornie-js/backend-user-domain/users';
import {
  UserCreateQueryFixtures,
  UserFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { TransactionProvisionOutputPort } from '../../../foundation/db/application';
import { UserPersistenceOutputPort } from '../ports/output/UserPersistenceOutputPort';
import { CreateUserUseCaseHandler } from './CreateUserUseCaseHandler';

describe(CreateUserUseCaseHandler.name, () => {
  let isValidUserCreateQuerySpecMock: jest.Mocked<
    ReportBasedSpec<[UserCreateQuery], string[]>
  >;
  let transactionProvisionOutputPortMock: jest.Mocked<TransactionProvisionOutputPort>;

  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;

  let createUserUseCaseHandler: CreateUserUseCaseHandler;

  beforeAll(() => {
    isValidUserCreateQuerySpecMock = {
      isSatisfiedOrReport: jest.fn(),
    };
    transactionProvisionOutputPortMock = {
      provide: jest.fn(),
    };
    userPersistenceOutputPortMock = {
      create: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    createUserUseCaseHandler = new CreateUserUseCaseHandler(
      isValidUserCreateQuerySpecMock,
      transactionProvisionOutputPortMock,
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
      let transactionWrapperMock: TransactionWrapper;
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        transactionWrapperMock = {
          [Symbol.asyncDispose]: jest.fn(),
          rollback: jest.fn(),
          tryCommit: jest
            .fn()
            .mockImplementationOnce(async (): Promise<void> => undefined),
        } as Partial<
          jest.Mocked<TransactionWrapper>
        > as jest.Mocked<TransactionWrapper>;

        userFixture = UserFixtures.any;

        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
        );
        isValidUserCreateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce({
          isRight: true,
          value: undefined,
        });
        userPersistenceOutputPortMock.create.mockResolvedValueOnce(userFixture);

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

      it('should call transactionProvisionOutputPort.provide()', () => {
        expect(
          transactionProvisionOutputPortMock.provide,
        ).toHaveBeenCalledTimes(1);
        expect(
          transactionProvisionOutputPortMock.provide,
        ).toHaveBeenCalledWith();
      });

      it('should call userPersistenceOutputPort.create()', () => {
        expect(userPersistenceOutputPortMock.create).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.create).toHaveBeenCalledWith(
          userCreateQueryFixture,
          transactionWrapperMock,
        );
      });

      it('should call transactionWrapper.tryCommit()', () => {
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledTimes(1);
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledWith();
      });

      it('should call transactionWrapper[Symbol.asyncDispose]()', () => {
        expect(
          transactionWrapperMock[Symbol.asyncDispose],
        ).toHaveBeenCalledTimes(1);
        expect(
          transactionWrapperMock[Symbol.asyncDispose],
        ).toHaveBeenCalledWith();
      });

      it('should return an UserV1', () => {
        expect(result).toBe(userFixture);
      });
    });
  });
});
