import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { Converter } from '@one-game-js/backend-common';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { UuidProviderOutputPort } from '../../../../foundation/common/application/ports/output/UuidProviderOutputPort';
import { HashContext } from '../../../../foundation/hash/application/models/HashContext';
import { BcryptHashProviderOutputPort } from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserCreateQueryFixtures } from '../../../domain/fixtures/UserCreateQueryFixtures';
import { UserFixtures } from '../../../domain/fixtures/UserFixtures';
import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
import { UserCreateQueryV1Fixtures } from '../../fixtures/UserCreateQueryV1Fixtures';
import { UserV1Fixtures } from '../../fixtures/UserV1Fixtures';
import { UserPersistenceOutputPort } from '../output/UserPersistenceOutputPort';
import { UserManagementInputPort } from './UserManagementInputPort';

describe(UserManagementInputPort.name, () => {
  let bcryptHashProviderOutputPortMock: jest.Mocked<BcryptHashProviderOutputPort>;
  let userCreateQueryV1ToUserCreateQueryConverterMock: jest.Mocked<
    Converter<
      apiModels.UserCreateQueryV1,
      UserCreateQuery,
      HashContext & UuidContext
    >
  >;
  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;
  let userToUserV1ConverterMock: jest.Mocked<Converter<User, apiModels.UserV1>>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let userManagementInputPort: UserManagementInputPort;

  beforeAll(() => {
    bcryptHashProviderOutputPortMock = { hash: jest.fn() } as Partial<
      jest.Mocked<BcryptHashProviderOutputPort>
    > as jest.Mocked<BcryptHashProviderOutputPort>;
    userCreateQueryV1ToUserCreateQueryConverterMock = { convert: jest.fn() };
    userPersistenceOutputPortMock = { create: jest.fn() };
    userToUserV1ConverterMock = { convert: jest.fn() };
    uuidProviderOutputPortMock = { generateV4: jest.fn() };

    userManagementInputPort = new UserManagementInputPort(
      bcryptHashProviderOutputPortMock,
      userCreateQueryV1ToUserCreateQueryConverterMock,
      userPersistenceOutputPortMock,
      userToUserV1ConverterMock,
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
        userCreateQueryV1ToUserCreateQueryConverterMock.convert.mockReturnValueOnce(
          userCreateQueryFixture,
        );
        userPersistenceOutputPortMock.create.mockResolvedValueOnce(userFixture);
        userToUserV1ConverterMock.convert.mockReturnValueOnce(userV1Fixture);

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

      it('should call userCreateQueryV1ToUserCreateQueryConverter.convert()', () => {
        const expectedContext: HashContext & UuidContext = {
          hash: hashFixture,
          uuid: uuidFixture,
        };

        expect(
          userCreateQueryV1ToUserCreateQueryConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          userCreateQueryV1ToUserCreateQueryConverterMock.convert,
        ).toHaveBeenCalledWith(userCreateQueryV1Fixture, expectedContext);
      });

      it('should call userPersistenceOutputPort.create()', () => {
        expect(userPersistenceOutputPortMock.create).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.create).toHaveBeenCalledWith(
          userCreateQueryFixture,
        );
      });

      it('should call userToUserV1Converter.convert()', () => {
        expect(userToUserV1ConverterMock.convert).toHaveBeenCalledTimes(1);
        expect(userToUserV1ConverterMock.convert).toHaveBeenCalledWith(
          userFixture,
        );
      });

      it('should return an UserV1', () => {
        expect(result).toBe(userV1Fixture);
      });
    });
  });
});
