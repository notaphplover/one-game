import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  UserCreateQueryFixtures,
  UserFindQueryFixtures,
  UserFixtures,
} from '@cornie-js/backend-app-user-fixtures';
import {
  User,
  UserCreateQuery,
  UserFindQuery,
} from '@cornie-js/backend-app-user-models';

import { CreateUserTypeOrmService } from '../services/CreateUserTypeOrmService';
import { FindUserTypeOrmService } from '../services/FindUserTypeOrmService';
import { UserPersistenceTypeOrmAdapter } from './UserPersistenceTypeOrmAdapter';

describe(UserPersistenceTypeOrmAdapter, () => {
  let createUserTypeOrmServiceMock: jest.Mocked<CreateUserTypeOrmService>;
  let findUserTypeOrmServiceMock: jest.Mocked<FindUserTypeOrmService>;

  let userPersistenceTypeOrmAdapter: UserPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createUserTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateUserTypeOrmService>
    > as jest.Mocked<CreateUserTypeOrmService>;

    findUserTypeOrmServiceMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindUserTypeOrmService>
    > as jest.Mocked<FindUserTypeOrmService>;

    userPersistenceTypeOrmAdapter = new UserPersistenceTypeOrmAdapter(
      createUserTypeOrmServiceMock,
      findUserTypeOrmServiceMock,
    );
  });

  describe('.create', () => {
    describe('when called', () => {
      let userCreateQueryFixture: UserCreateQuery;
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userCreateQueryFixture = UserCreateQueryFixtures.any;
        userFixture = Symbol() as unknown as User;

        createUserTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          userFixture,
        );

        result = await userPersistenceTypeOrmAdapter.create(
          userCreateQueryFixture,
        );
      });

      it('should call CreateUserTypeOrmService.insertOne()', () => {
        expect(createUserTypeOrmServiceMock.insertOne).toHaveBeenCalledTimes(1);
        expect(createUserTypeOrmServiceMock.insertOne).toHaveBeenCalledWith(
          userCreateQueryFixture,
        );
      });

      it('should return a User', () => {
        expect(result).toBe(userFixture);
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

        result = await userPersistenceTypeOrmAdapter.findOne(
          userFindQueryFixture,
        );
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
});
