import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  UserCode,
  UserCodeCreateQuery,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';
import {
  UserCodeCreateQueryFixtures,
  UserCodeFindQueryFixtures,
  UserCodeFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { CreateUserCodeTypeOrmService } from '../services/CreateUserCodeTypeOrmService';
import { DeleteUserCodeTypeOrmService } from '../services/DeleteUserCodeTypeOrmService';
import { FindUserCodeTypeOrmService } from '../services/FindUserCodeTypeOrmService';
import { UserCodePersistenceTypeOrmAdapter } from './UserCodePersistenceTypeOrmAdapter';

describe(UserCodePersistenceTypeOrmAdapter, () => {
  let createUserCodeTypeOrmServiceMock: jest.Mocked<CreateUserCodeTypeOrmService>;
  let deleteUserCodeTypeOrmServiceMock: jest.Mocked<DeleteUserCodeTypeOrmService>;
  let findUserCodeTypeOrmServiceMock: jest.Mocked<FindUserCodeTypeOrmService>;

  let userCodePersistenceTypeOrmAdapter: UserCodePersistenceTypeOrmAdapter;

  beforeAll(() => {
    createUserCodeTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateUserCodeTypeOrmService>
    > as jest.Mocked<CreateUserCodeTypeOrmService>;

    deleteUserCodeTypeOrmServiceMock = {
      delete: jest.fn(),
    } as Partial<
      jest.Mocked<DeleteUserCodeTypeOrmService>
    > as jest.Mocked<DeleteUserCodeTypeOrmService>;

    findUserCodeTypeOrmServiceMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindUserCodeTypeOrmService>
    > as jest.Mocked<FindUserCodeTypeOrmService>;

    userCodePersistenceTypeOrmAdapter = new UserCodePersistenceTypeOrmAdapter(
      createUserCodeTypeOrmServiceMock,
      deleteUserCodeTypeOrmServiceMock,
      findUserCodeTypeOrmServiceMock,
    );
  });

  describe('.create', () => {
    describe('when called', () => {
      let userCodeCreateQueryFixture: UserCodeCreateQuery;
      let transactionWrapperFixture: TransactionWrapper;

      let userCodeFixture: UserCode;

      let result: unknown;

      beforeAll(async () => {
        userCodeCreateQueryFixture = UserCodeCreateQueryFixtures.any;
        transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;

        userCodeFixture = Symbol() as unknown as UserCode;

        createUserCodeTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          userCodeFixture,
        );

        result = await userCodePersistenceTypeOrmAdapter.create(
          userCodeCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should call CreateUserCodeTypeOrmService.insertOne()', () => {
        expect(
          createUserCodeTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(createUserCodeTypeOrmServiceMock.insertOne).toHaveBeenCalledWith(
          userCodeCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return a UserCode', () => {
        expect(result).toBe(userCodeFixture);
      });
    });
  });

  describe('.delete', () => {
    let userCodeFindQueryFixture: UserCodeFindQuery;

    beforeAll(() => {
      userCodeFindQueryFixture = UserCodeFindQueryFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        deleteUserCodeTypeOrmServiceMock.delete.mockResolvedValueOnce(
          undefined,
        );

        result = await userCodePersistenceTypeOrmAdapter.delete(
          userCodeFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call deleteUserCodeTypeOrmService.delete()', () => {
        expect(deleteUserCodeTypeOrmServiceMock.delete).toHaveBeenCalledTimes(
          1,
        );
        expect(deleteUserCodeTypeOrmServiceMock.delete).toHaveBeenCalledWith(
          userCodeFindQueryFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.findOne', () => {
    let userCodeFindQueryFixture: UserCodeFindQuery;

    beforeAll(() => {
      userCodeFindQueryFixture = UserCodeFindQueryFixtures.any;
    });

    describe('when called', () => {
      let userCodeFixture: UserCode;

      let result: unknown;

      beforeAll(async () => {
        userCodeFixture = UserCodeFixtures.any;

        findUserCodeTypeOrmServiceMock.findOne.mockResolvedValueOnce(
          userCodeFixture,
        );

        result = await userCodePersistenceTypeOrmAdapter.findOne(
          userCodeFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findUserCodeTypeOrmService.findOne()', () => {
        expect(findUserCodeTypeOrmServiceMock.findOne).toHaveBeenCalledTimes(1);
        expect(findUserCodeTypeOrmServiceMock.findOne).toHaveBeenCalledWith(
          userCodeFindQueryFixture,
        );
      });

      it('should return a UserCode', () => {
        expect(result).toBe(userCodeFixture);
      });
    });
  });
});
