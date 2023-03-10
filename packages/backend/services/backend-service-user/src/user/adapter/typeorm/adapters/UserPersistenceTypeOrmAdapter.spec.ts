import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UserCreateQueryFixtures } from '../../../domain/fixtures/UserCreateQueryFixtures';
import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
import { CreateUserTypeOrmService } from '../services/CreateUserTypeOrmService';
import { UserPersistenceTypeOrmAdapter } from './UserPersistenceTypeOrmAdapter';

describe(UserPersistenceTypeOrmAdapter, () => {
  let createUserTypeOrmServiceMock: jest.Mocked<CreateUserTypeOrmService>;

  let userPersistenceTypeOrmAdapter: UserPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createUserTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateUserTypeOrmService>
    > as jest.Mocked<CreateUserTypeOrmService>;

    userPersistenceTypeOrmAdapter = new UserPersistenceTypeOrmAdapter(
      createUserTypeOrmServiceMock,
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
});
