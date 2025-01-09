import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  User,
  UserCreateQuery,
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import {
  UserCreateQueryFixtures,
  UserFindQueryFixtures,
  UserFixtures,
  UserUpdateQueryFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { CreateUserTypeOrmService } from '../services/CreateUserTypeOrmService';
import { DeleteUserTypeOrmService } from '../services/DeleteUserTypeOrmService';
import { FindUserTypeOrmService } from '../services/FindUserTypeOrmService';
import { UpdateUserTypeOrmService } from '../services/UpdateUserTypeOrmService';
import { UserPersistenceTypeOrmAdapter } from './UserPersistenceTypeOrmAdapter';

describe(UserPersistenceTypeOrmAdapter, () => {
  let createUserTypeOrmServiceMock: jest.Mocked<CreateUserTypeOrmService>;
  let deleteUserTypeOrmServiceMock: jest.Mocked<DeleteUserTypeOrmService>;
  let findUserTypeOrmServiceMock: jest.Mocked<FindUserTypeOrmService>;
  let updateUserTypeOrmServiceMock: jest.Mocked<UpdateUserTypeOrmService>;

  let userPersistenceTypeOrmAdapter: UserPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createUserTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateUserTypeOrmService>
    > as jest.Mocked<CreateUserTypeOrmService>;

    deleteUserTypeOrmServiceMock = {
      delete: jest.fn(),
    } as Partial<
      jest.Mocked<DeleteUserTypeOrmService>
    > as jest.Mocked<DeleteUserTypeOrmService>;

    findUserTypeOrmServiceMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindUserTypeOrmService>
    > as jest.Mocked<FindUserTypeOrmService>;

    updateUserTypeOrmServiceMock = {
      update: jest.fn(),
    } as Partial<
      jest.Mocked<UpdateUserTypeOrmService>
    > as jest.Mocked<UpdateUserTypeOrmService>;

    userPersistenceTypeOrmAdapter = new UserPersistenceTypeOrmAdapter(
      createUserTypeOrmServiceMock,
      deleteUserTypeOrmServiceMock,
      findUserTypeOrmServiceMock,
      updateUserTypeOrmServiceMock,
    );
  });

  describe('.create', () => {
    describe('when called', () => {
      let userCreateQueryFixture: UserCreateQuery;
      let transactionWrapperFixture: TransactionWrapper;

      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userCreateQueryFixture = UserCreateQueryFixtures.any;
        transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;

        userFixture = Symbol() as unknown as User;

        createUserTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          userFixture,
        );

        result = await userPersistenceTypeOrmAdapter.create(
          userCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should call CreateUserTypeOrmService.insertOne()', () => {
        expect(createUserTypeOrmServiceMock.insertOne).toHaveBeenCalledTimes(1);
        expect(createUserTypeOrmServiceMock.insertOne).toHaveBeenCalledWith(
          userCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return a User', () => {
        expect(result).toBe(userFixture);
      });
    });
  });

  describe('.delete', () => {
    let userFindQueryFixture: UserFindQuery;

    beforeAll(() => {
      userFindQueryFixture = UserFindQueryFixtures.withId;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        deleteUserTypeOrmServiceMock.delete.mockResolvedValueOnce(undefined);

        result =
          await userPersistenceTypeOrmAdapter.delete(userFindQueryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call deleteUserTypeOrmService.delete()', () => {
        expect(deleteUserTypeOrmServiceMock.delete).toHaveBeenCalledTimes(1);
        expect(deleteUserTypeOrmServiceMock.delete).toHaveBeenCalledWith(
          userFindQueryFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.find', () => {
    let userFindQueryFixture: UserFindQuery;

    beforeAll(() => {
      userFindQueryFixture = UserFindQueryFixtures.withId;
    });

    describe('when called', () => {
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;

        findUserTypeOrmServiceMock.find.mockResolvedValueOnce([userFixture]);

        result = await userPersistenceTypeOrmAdapter.find(userFindQueryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findUserTypeOrmService.find()', () => {
        expect(findUserTypeOrmServiceMock.find).toHaveBeenCalledTimes(1);
        expect(findUserTypeOrmServiceMock.find).toHaveBeenCalledWith(
          userFindQueryFixture,
        );
      });

      it('should return User[]', () => {
        expect(result).toStrictEqual([userFixture]);
      });
    });
  });

  describe('.findOne', () => {
    let userFindQueryFixture: UserFindQuery;

    beforeAll(() => {
      userFindQueryFixture = UserFindQueryFixtures.withId;
    });

    describe('when called', () => {
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;

        findUserTypeOrmServiceMock.findOne.mockResolvedValueOnce(userFixture);

        result =
          await userPersistenceTypeOrmAdapter.findOne(userFindQueryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findUserTypeOrmService.findOne()', () => {
        expect(findUserTypeOrmServiceMock.findOne).toHaveBeenCalledTimes(1);
        expect(findUserTypeOrmServiceMock.findOne).toHaveBeenCalledWith(
          userFindQueryFixture,
        );
      });

      it('should return a User', () => {
        expect(result).toBe(userFixture);
      });
    });
  });

  describe('.update', () => {
    describe('when called', () => {
      let userUpdateQueryFixture: UserUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        userUpdateQueryFixture = UserUpdateQueryFixtures.any;

        updateUserTypeOrmServiceMock.update.mockResolvedValueOnce(undefined);

        result = await userPersistenceTypeOrmAdapter.update(
          userUpdateQueryFixture,
        );
      });

      it('should call UpdateUserTypeOrmService.update()', () => {
        expect(updateUserTypeOrmServiceMock.update).toHaveBeenCalledTimes(1);
        expect(updateUserTypeOrmServiceMock.update).toHaveBeenCalledWith(
          userUpdateQueryFixture,
        );
      });

      it('should return a User', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
