import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { JwtService } from '@cornie-js/backend-app-jwt';
import { UserFixtures } from '@cornie-js/backend-app-user-fixtures';
import {
  UserJwtPayload,
  UserPersistenceOutputPort,
  User,
  UserFindQuery,
} from '@cornie-js/backend-app-user-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { BcryptHashProviderOutputPort } from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { AuthManagementInputPort } from './AuthManagementInputPort';

describe(AuthManagementInputPort.name, () => {
  let bcryptHashProviderOutputPortMock: jest.Mocked<BcryptHashProviderOutputPort>;
  let jwtServiceMock: jest.Mocked<JwtService<UserJwtPayload>>;
  let userPersistenceOuptutPortMock: jest.Mocked<UserPersistenceOutputPort>;

  let authManagementInputPort: AuthManagementInputPort;

  beforeAll(() => {
    bcryptHashProviderOutputPortMock = {
      verify: jest.fn(),
    } as Partial<
      jest.Mocked<BcryptHashProviderOutputPort>
    > as jest.Mocked<BcryptHashProviderOutputPort>;
    jwtServiceMock = {
      create: jest.fn(),
    } as Partial<jest.Mocked<JwtService<UserJwtPayload>>> as jest.Mocked<
      JwtService<UserJwtPayload>
    >;
    userPersistenceOuptutPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserPersistenceOutputPort>
    > as jest.Mocked<UserPersistenceOutputPort>;

    authManagementInputPort = new AuthManagementInputPort(
      bcryptHashProviderOutputPortMock,
      jwtServiceMock,
      userPersistenceOuptutPortMock,
    );
  });

  describe('.create', () => {
    let authCreateQueryV1Fixture: apiModels.AuthCreateQueryV1;

    beforeAll(() => {
      authCreateQueryV1Fixture = {
        email: 'mail@example.com',
        password: 'sample-password',
      };
    });

    describe('when called', () => {
      let userFixture: User;
      let jwtFixture: string;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;
        jwtFixture = 'jwtFixture';

        userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );

        bcryptHashProviderOutputPortMock.verify.mockResolvedValueOnce(true);

        jwtServiceMock.create.mockResolvedValueOnce(jwtFixture);

        result = await authManagementInputPort.create(authCreateQueryV1Fixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOuptutPort.findOne()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          email: authCreateQueryV1Fixture.email,
        };

        expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledWith(
          expectedUserFindQuery,
        );
      });

      it('should call bcryptHashProviderOutputPort.verify()', () => {
        expect(bcryptHashProviderOutputPortMock.verify).toHaveBeenCalledTimes(
          1,
        );
        expect(bcryptHashProviderOutputPortMock.verify).toHaveBeenCalledWith(
          authCreateQueryV1Fixture.password,
          userFixture.passwordHash,
        );
      });

      it('should call jwtServiceMock.create()', () => {
        expect(jwtServiceMock.create).toHaveBeenCalledTimes(1);
        expect(jwtServiceMock.create).toHaveBeenCalledWith({
          sub: userFixture.id,
        });
      });

      it('should return an AuthV1', () => {
        const expected: apiModels.AuthV1 = {
          jwt: jwtFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and userPersistenceOuptutPortMock.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(undefined);

        try {
          await authManagementInputPort.create(authCreateQueryV1Fixture);
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOuptutPort.findOne()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          email: authCreateQueryV1Fixture.email,
        };

        expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledWith(
          expectedUserFindQuery,
        );
      });

      it('should not call bcryptHashProviderOutputPort.verify()', () => {
        expect(bcryptHashProviderOutputPortMock.verify).not.toHaveBeenCalled();
      });

      it('should not call jwtServiceMock.create()', () => {
        expect(jwtServiceMock.create).not.toHaveBeenCalled();
      });

      it('should throw an AppError', () => {
        const expected: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: 'Invalid credentials',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(expect.objectContaining(expected));
      });
    });

    describe('when called, and bcryptHashProviderOutputPort.verify() returns false', () => {
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;

        userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );
        bcryptHashProviderOutputPortMock.verify.mockResolvedValueOnce(false);

        try {
          await authManagementInputPort.create(authCreateQueryV1Fixture);
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOuptutPort.findOne()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          email: authCreateQueryV1Fixture.email,
        };

        expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledWith(
          expectedUserFindQuery,
        );
      });

      it('should call bcryptHashProviderOutputPort.verify()', () => {
        expect(bcryptHashProviderOutputPortMock.verify).toHaveBeenCalledTimes(
          1,
        );
        expect(bcryptHashProviderOutputPortMock.verify).toHaveBeenCalledWith(
          authCreateQueryV1Fixture.password,
          userFixture.passwordHash,
        );
      });

      it('should not call jwtServiceMock.create()', () => {
        expect(jwtServiceMock.create).not.toHaveBeenCalled();
      });

      it('should throw an AppError', () => {
        const expected: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: 'Invalid credentials',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(expect.objectContaining(expected));
      });
    });
  });
});
