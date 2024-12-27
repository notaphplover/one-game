import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import { Builder, BuilderAsync, Handler } from '@cornie-js/backend-common';
import {
  User,
  UserCodeFindQuery,
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

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { UserCreateQueryV1Fixtures } from '../../fixtures/UserCreateQueryV1Fixtures';
import { UserMeUpdateQueryV1Fixtures } from '../../fixtures/UserMeUpdateQueryV1Fixtures';
import { UserV1Fixtures } from '../../fixtures/UserV1Fixtures';
import { UserCodePersistenceOutputPort } from '../output/UserCodePersistenceOutputPort';
import { UserPersistenceOutputPort } from '../output/UserPersistenceOutputPort';
import { UserManagementInputPort } from './UserManagementInputPort';

describe(UserManagementInputPort.name, () => {
  let createUserUseCaseHandlerMock: jest.Mocked<
    Handler<[UserCreateQuery], User>
  >;
  let updateUserUseCaseHandlerMock: jest.Mocked<
    Handler<[UserUpdateQuery], User>
  >;
  let userCodePersistenceOutputPortMock: jest.Mocked<UserCodePersistenceOutputPort>;
  let userCreateQueryFromUserCreateQueryV1BuilderMock: jest.Mocked<
    BuilderAsync<UserCreateQuery, [apiModels.UserCreateQueryV1, UuidContext]>
  >;
  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;
  let userUpdateQueryFromUserMeUpdateQueryV1BuilderMock: jest.Mocked<
    BuilderAsync<UserUpdateQuery, [apiModels.UserMeUpdateQueryV1, UuidContext]>
  >;
  let userV1FromUserBuilderMock: jest.Mocked<Builder<apiModels.UserV1, [User]>>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let userManagementInputPort: UserManagementInputPort;

  beforeAll(() => {
    createUserUseCaseHandlerMock = {
      handle: jest.fn(),
    };
    updateUserUseCaseHandlerMock = {
      handle: jest.fn(),
    };
    userCodePersistenceOutputPortMock = {
      delete: jest.fn(),
    } as Partial<
      jest.Mocked<UserCodePersistenceOutputPort>
    > as jest.Mocked<UserCodePersistenceOutputPort>;
    userCreateQueryFromUserCreateQueryV1BuilderMock = {
      build: jest.fn(),
    };
    userPersistenceOutputPortMock = {
      create: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };
    userUpdateQueryFromUserMeUpdateQueryV1BuilderMock = {
      build: jest.fn(),
    };
    userV1FromUserBuilderMock = { build: jest.fn() };
    uuidProviderOutputPortMock = { generateV4: jest.fn() };

    userManagementInputPort = new UserManagementInputPort(
      createUserUseCaseHandlerMock,
      updateUserUseCaseHandlerMock,
      userCodePersistenceOutputPortMock,
      userCreateQueryFromUserCreateQueryV1BuilderMock,
      userPersistenceOutputPortMock,
      userUpdateQueryFromUserMeUpdateQueryV1BuilderMock,
      userV1FromUserBuilderMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.create', () => {
    let userCreateQueryV1Fixture: apiModels.UserCreateQueryV1;

    beforeAll(() => {
      userCreateQueryV1Fixture = UserCreateQueryV1Fixtures.any;
    });

    describe('when called, and isValidUserCreateQuerySpecMock.isSatisfiedOrReport() returns Right', () => {
      let userCreateQueryFixture: UserCreateQuery;
      let userFixture: User;
      let userV1Fixture: apiModels.UserV1;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        userCreateQueryFixture = UserCreateQueryFixtures.any;
        userFixture = UserFixtures.any;
        userV1Fixture = UserV1Fixtures.any;
        uuidFixture = '83073aec-b81b-4107-97f9-baa46de5dd40';

        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(uuidFixture);
        userCreateQueryFromUserCreateQueryV1BuilderMock.build.mockResolvedValueOnce(
          userCreateQueryFixture,
        );
        createUserUseCaseHandlerMock.handle.mockResolvedValueOnce(userFixture);
        userV1FromUserBuilderMock.build.mockReturnValueOnce(userV1Fixture);

        result = await userManagementInputPort.create(userCreateQueryV1Fixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call uuidProviderOutputPort.generateV4()', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(1);
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
      });

      it('should call userCreateQueryFromUserCreateQueryV1Builder.build()', () => {
        const expectedContext: UuidContext = {
          uuid: uuidFixture,
        };

        expect(
          userCreateQueryFromUserCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          userCreateQueryFromUserCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledWith(userCreateQueryV1Fixture, expectedContext);
      });

      it('should call createUserUseCaseHandler.handle()', () => {
        expect(createUserUseCaseHandlerMock.handle).toHaveBeenCalledTimes(1);
        expect(createUserUseCaseHandlerMock.handle).toHaveBeenCalledWith(
          userCreateQueryFixture,
        );
      });

      it('should call userV1FromUserBuilder.build()', () => {
        expect(userV1FromUserBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(userV1FromUserBuilderMock.build).toHaveBeenCalledWith(
          userFixture,
        );
      });

      it('should return an UserV1', () => {
        expect(result).toBe(userV1Fixture);
      });
    });
  });

  describe('.delete', () => {
    let idFixture: string;

    beforeAll(() => {
      idFixture = '83073aec-b81b-4107-97f9-baa46de5dd40';
    });

    describe('when called, and userPersistenceOutputPort.findOne() returns User', () => {
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;

        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );

        userCodePersistenceOutputPortMock.delete.mockResolvedValueOnce(
          undefined,
        );
        userPersistenceOutputPortMock.delete.mockResolvedValueOnce(undefined);

        result = await userManagementInputPort.delete(idFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          id: idFixture,
        };

        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedUserFindQuery,
        );
      });

      it('should call userCodePersistenceOutputPort.delete()', () => {
        const expected: UserCodeFindQuery = {
          userId: userFixture.id,
        };
        expect(userCodePersistenceOutputPortMock.delete).toHaveBeenCalledTimes(
          1,
        );
        expect(userCodePersistenceOutputPortMock.delete).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call userPersistenceOutputPort.delete()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          id: idFixture,
        };

        expect(userPersistenceOutputPortMock.delete).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.delete).toHaveBeenCalledWith(
          expectedUserFindQuery,
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
      let userV1Fixture: apiModels.UserV1;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;
        userV1Fixture = UserV1Fixtures.any;

        userPersistenceOutputPortMock.find.mockResolvedValueOnce([userFixture]);

        userV1FromUserBuilderMock.build.mockReturnValueOnce(userV1Fixture);

        result = await userManagementInputPort.find(userFindQueryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOutputPort.find()', () => {
        expect(userPersistenceOutputPortMock.find).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.find).toHaveBeenCalledWith(
          userFindQueryFixture,
        );
      });

      it('should call userV1FromUserBuilder.build()', () => {
        expect(userV1FromUserBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(userV1FromUserBuilderMock.build).toHaveBeenCalledWith(
          userFixture,
        );
      });

      it('should return an UserV1', () => {
        expect(result).toStrictEqual([userV1Fixture]);
      });
    });
  });

  describe('.findOne', () => {
    let idFixture: string;

    beforeAll(() => {
      idFixture = '83073aec-b81b-4107-97f9-baa46de5dd40';
    });

    describe('when called, and userPersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

        result = await userManagementInputPort.findOne(idFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          id: idFixture,
        };

        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedUserFindQuery,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and userPersistenceOutputPort.findOne() returns a User', () => {
      let userFixture: User;
      let userV1Fixture: apiModels.UserV1;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;
        userV1Fixture = UserV1Fixtures.any;

        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );

        userV1FromUserBuilderMock.build.mockReturnValueOnce(userV1Fixture);

        result = await userManagementInputPort.findOne(idFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          id: idFixture,
        };

        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedUserFindQuery,
        );
      });

      it('should call userV1FromUserBuilder.build()', () => {
        expect(userV1FromUserBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(userV1FromUserBuilderMock.build).toHaveBeenCalledWith(
          userFixture,
        );
      });

      it('should return an UserV1', () => {
        expect(result).toBe(userV1Fixture);
      });
    });
  });

  describe('.updateMe', () => {
    let userIdFixture: string;
    let userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1;

    beforeAll(() => {
      userIdFixture = '83073aec-b81b-4107-97f9-baa46de5dd40';
      userMeUpdateQueryV1 = UserMeUpdateQueryV1Fixtures.any;
    });

    describe('when called', () => {
      let userFixture: User;
      let userUpdateQueryFixture: UserUpdateQuery;
      let userV1Fixture: apiModels.UserV1;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;
        userUpdateQueryFixture = UserUpdateQueryFixtures.any;
        userV1Fixture = UserV1Fixtures.any;

        userUpdateQueryFromUserMeUpdateQueryV1BuilderMock.build.mockResolvedValueOnce(
          userUpdateQueryFixture,
        );

        updateUserUseCaseHandlerMock.handle.mockResolvedValueOnce(userFixture);

        userV1FromUserBuilderMock.build.mockReturnValueOnce(userV1Fixture);

        result = await userManagementInputPort.updateMe(
          userIdFixture,
          userMeUpdateQueryV1,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userUpdateQueryFromUserMeUpdateQueryV1Builder.build()', () => {
        const expectedUuidContext: UuidContext = { uuid: userIdFixture };

        expect(
          userUpdateQueryFromUserMeUpdateQueryV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          userUpdateQueryFromUserMeUpdateQueryV1BuilderMock.build,
        ).toHaveBeenCalledWith(userMeUpdateQueryV1, expectedUuidContext);
      });

      it('should call updateUserUseCaseHandler.handle()', () => {
        expect(updateUserUseCaseHandlerMock.handle).toHaveBeenCalledTimes(1);
        expect(updateUserUseCaseHandlerMock.handle).toHaveBeenCalledWith(
          userUpdateQueryFixture,
        );
      });

      it('should return a UserV1', () => {
        expect(result).toBe(userV1Fixture);
      });
    });
  });
});
