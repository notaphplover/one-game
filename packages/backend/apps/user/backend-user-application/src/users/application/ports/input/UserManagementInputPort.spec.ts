import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  User,
  UserCreateQuery,
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import {
  UserCreateQueryFixtures,
  UserFixtures,
  UserUpdateQueryFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../../foundation/hash/application/models/HashContext';
import { BcryptHashProviderOutputPort } from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserCreateQueryV1Fixtures } from '../../fixtures/UserCreateQueryV1Fixtures';
import { UserMeUpdateQueryV1Fixtures } from '../../fixtures/UserMeUpdateQueryV1Fixtures';
import { UserV1Fixtures } from '../../fixtures/UserV1Fixtures';
import { UserPersistenceOutputPort } from '../output/UserPersistenceOutputPort';
import { UserManagementInputPort } from './UserManagementInputPort';

describe(UserManagementInputPort.name, () => {
  let bcryptHashProviderOutputPortMock: jest.Mocked<BcryptHashProviderOutputPort>;
  let userCreateQueryFromUserCreateQueryV1BuilderMock: jest.Mocked<
    Builder<
      UserCreateQuery,
      [apiModels.UserCreateQueryV1, HashContext & UuidContext]
    >
  >;
  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;
  let userUpdateQueryFromUserMeUpdateQueryV1BuilderMock: jest.Mocked<
    Builder<UserUpdateQuery, [apiModels.UserMeUpdateQueryV1, UuidContext]>
  >;
  let userV1FromUserBuilderMock: jest.Mocked<Builder<apiModels.UserV1, [User]>>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let userManagementInputPort: UserManagementInputPort;

  beforeAll(() => {
    bcryptHashProviderOutputPortMock = { hash: jest.fn() } as Partial<
      jest.Mocked<BcryptHashProviderOutputPort>
    > as jest.Mocked<BcryptHashProviderOutputPort>;
    userCreateQueryFromUserCreateQueryV1BuilderMock = {
      build: jest.fn(),
    };
    userPersistenceOutputPortMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };
    userUpdateQueryFromUserMeUpdateQueryV1BuilderMock = {
      build: jest.fn(),
    };
    userV1FromUserBuilderMock = { build: jest.fn() };
    uuidProviderOutputPortMock = { generateV4: jest.fn() };

    userManagementInputPort = new UserManagementInputPort(
      bcryptHashProviderOutputPortMock,
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

    describe('when called', () => {
      let hashFixture: string;
      let userCreateQueryFixture: UserCreateQuery;
      let userFixture: User;
      let userV1Fixture: apiModels.UserV1;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        hashFixture =
          '$2y$10$/Q/7HB2eWCzGILadcebdf.8fvya0/cnYkPdgy4q63K3IGdlnpc.7K';
        userCreateQueryFixture = UserCreateQueryFixtures.any;
        userFixture = UserFixtures.any;
        userV1Fixture = UserV1Fixtures.any;
        uuidFixture = '83073aec-b81b-4107-97f9-baa46de5dd40';

        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(uuidFixture);
        bcryptHashProviderOutputPortMock.hash.mockResolvedValueOnce(
          hashFixture,
        );
        userCreateQueryFromUserCreateQueryV1BuilderMock.build.mockReturnValueOnce(
          userCreateQueryFixture,
        );
        userPersistenceOutputPortMock.create.mockResolvedValueOnce(userFixture);
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

      it('should call bcryptHashProviderOutputPort.hash()', () => {
        expect(bcryptHashProviderOutputPortMock.hash).toHaveBeenCalledTimes(1);
        expect(bcryptHashProviderOutputPortMock.hash).toHaveBeenCalledWith(
          userCreateQueryV1Fixture.password,
        );
      });

      it('should call userCreateQueryConverterFromUserCreateQueryV1Builder.build()', () => {
        const expectedContext: HashContext & UuidContext = {
          hash: hashFixture,
          uuid: uuidFixture,
        };

        expect(
          userCreateQueryFromUserCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          userCreateQueryFromUserCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledWith(userCreateQueryV1Fixture, expectedContext);
      });

      it('should call userPersistenceOutputPort.create()', () => {
        expect(userPersistenceOutputPortMock.create).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.create).toHaveBeenCalledWith(
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

    describe('when called, and userPersistenceOutputPort.findOne() returns a user', () => {
      let userFixture: User;
      let userUpdateQueryFixture: UserUpdateQuery;
      let userV1Fixture: apiModels.UserV1;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;
        userUpdateQueryFixture = UserUpdateQueryFixtures.any;
        userV1Fixture = UserV1Fixtures.any;

        userUpdateQueryFromUserMeUpdateQueryV1BuilderMock.build.mockReturnValueOnce(
          userUpdateQueryFixture,
        );

        userPersistenceOutputPortMock.update.mockResolvedValueOnce(undefined);
        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );

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

      it('should call userPersistenceOutputPort.update()', () => {
        expect(userPersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.update).toHaveBeenCalledWith(
          userUpdateQueryFixture,
        );
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        const expected: UserFindQuery = { id: userIdFixture };

        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should return a userV1', () => {
        expect(result).toBe(userV1Fixture);
      });
    });

    describe('when called, and userPersistenceOutputPort.findOne() returns undefined', () => {
      let userUpdateQueryFixture: UserUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        userUpdateQueryFixture = UserUpdateQueryFixtures.any;

        userUpdateQueryFromUserMeUpdateQueryV1BuilderMock.build.mockReturnValueOnce(
          userUpdateQueryFixture,
        );

        userPersistenceOutputPortMock.update.mockResolvedValueOnce(undefined);
        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

        try {
          await userManagementInputPort.updateMe(
            userIdFixture,
            userMeUpdateQueryV1,
          );
        } catch (error) {
          result = error;
        }
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

      it('should call userPersistenceOutputPort.update()', () => {
        expect(userPersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.update).toHaveBeenCalledWith(
          userUpdateQueryFixture,
        );
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        const expected: UserFindQuery = { id: userIdFixture };

        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should throw an error', () => {
        const errorProperties: Partial<AppError> = {
          kind: AppErrorKind.unknown,
          message: expect.stringContaining(
            'Unable to fetch user "',
          ) as unknown as string,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(expect.objectContaining(errorProperties));
      });
    });
  });
});
