import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { JwtService } from '@cornie-js/backend-app-jwt';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  User,
  UserCanCreateAuthSpec,
  UserCode,
  UserCodeFindQuery,
  UserFindQuery,
} from '@cornie-js/backend-user-domain/users';
import {
  UserCodeFixtures,
  UserFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { BcryptHashProviderOutputPort } from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserJwtPayload } from '../../../../users/application/models/UserJwtPayload';
import { UserCodePersistenceOutputPort } from '../../../../users/application/ports/output/UserCodePersistenceOutputPort';
import { UserPersistenceOutputPort } from '../../../../users/application/ports/output/UserPersistenceOutputPort';
import { AuthManagementInputPort } from './AuthManagementInputPort';

describe(AuthManagementInputPort.name, () => {
  let bcryptHashProviderOutputPortMock: jest.Mocked<BcryptHashProviderOutputPort>;
  let jwtServiceMock: jest.Mocked<JwtService<UserJwtPayload>>;
  let userCanCreateAuthSpecMock: jest.Mocked<UserCanCreateAuthSpec>;
  let userCodePersistenceOuptutPortMock: jest.Mocked<UserCodePersistenceOutputPort>;
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
    userCanCreateAuthSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    userCodePersistenceOuptutPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserCodePersistenceOutputPort>
    > as jest.Mocked<UserCodePersistenceOutputPort>;
    userPersistenceOuptutPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserPersistenceOutputPort>
    > as jest.Mocked<UserPersistenceOutputPort>;

    authManagementInputPort = new AuthManagementInputPort(
      bcryptHashProviderOutputPortMock,
      jwtServiceMock,
      userCanCreateAuthSpecMock,
      userCodePersistenceOuptutPortMock,
      userPersistenceOuptutPortMock,
    );
  });

  describe('.create', () => {
    describe('having an EmailPasswordAuthCreateQueryV1', () => {
      let authCreateQueryV1Fixture: apiModels.EmailPasswordAuthCreateQueryV1;

      beforeAll(() => {
        authCreateQueryV1Fixture = {
          email: 'mail@example.com',
          password: 'sample-password',
        };
      });

      describe('when called, and userPersistenceOuptutPortMock.findOne() returns undefined', () => {
        let result: unknown;

        beforeAll(async () => {
          userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

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

          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should not call bcryptHashProviderOutputPort.verify()', () => {
          expect(
            bcryptHashProviderOutputPortMock.verify,
          ).not.toHaveBeenCalled();
        });

        it('should not call jwtServiceMock.create()', () => {
          expect(jwtServiceMock.create).not.toHaveBeenCalled();
        });

        it('should throw an AppError', () => {
          const expected: Partial<AppError> = {
            kind: AppErrorKind.missingCredentials,
            message: 'Invalid credentials',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });

      describe('when called, and userPersistenceOuptutPortMock.findOne() returns UserV1 and userCanCreateAuthSpec.isSatisfiedBy() returns true', () => {
        let userFixture: User;
        let jwtFixture: string;

        let result: unknown;

        beforeAll(async () => {
          userFixture = UserFixtures.any;
          jwtFixture = 'jwtFixture';

          userCanCreateAuthSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );

          bcryptHashProviderOutputPortMock.verify.mockResolvedValueOnce(true);

          jwtServiceMock.create.mockResolvedValueOnce(jwtFixture);

          result = await authManagementInputPort.create(
            authCreateQueryV1Fixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userPersistenceOuptutPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            email: authCreateQueryV1Fixture.email,
          };

          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should call userCanCreateAuthSpecMock.isSatisfiedBy()', () => {
          expect(userCanCreateAuthSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
            1,
          );
          expect(userCanCreateAuthSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            userFixture,
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

      describe('when called, and userPersistenceOuptutPortMock.findOne() returns UserV1 and userCanCreateAuthSpec.isSatisfiedBy() returns false', () => {
        let userFixture: User;

        let result: unknown;

        beforeAll(async () => {
          userFixture = UserFixtures.any;

          userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );

          userCanCreateAuthSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

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

          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should call userCanCreateAuthSpecMock.isSatisfiedBy()', () => {
          expect(userCanCreateAuthSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
            1,
          );
          expect(userCanCreateAuthSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            userFixture,
          );
        });

        it('should throw an AppError', () => {
          const expected: Partial<AppError> = {
            kind: AppErrorKind.missingCredentials,
            message:
              'Unable to generate user credentials due to the current user state',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });

      describe('when called, and userCanCreateAuthSpec.isSatisfiedBy() returns true and bcryptHashProviderOutputPort.verify() returns false', () => {
        let userFixture: User;

        let result: unknown;

        beforeAll(async () => {
          userFixture = UserFixtures.any;

          userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );
          userCanCreateAuthSpecMock.isSatisfiedBy.mockReturnValueOnce(true);
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

          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
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
            kind: AppErrorKind.missingCredentials,
            message: 'Invalid credentials',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });
    });

    describe('having an CodeAuthCreateQueryV1', () => {
      let authCreateQueryV1Fixture: apiModels.CodeAuthCreateQueryV1;

      beforeAll(() => {
        authCreateQueryV1Fixture = {
          code: 'qwertyuiop',
        };
      });

      describe('when called, and userCodePersistenceOuptutPortMock.findOne() returns undefined', () => {
        let result: unknown;

        beforeAll(async () => {
          userCodePersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await authManagementInputPort.create(authCreateQueryV1Fixture);
          } catch (error) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userCodePersistenceOuptutPort.findOne()', () => {
          const expectedUserCodeFindQuery: UserCodeFindQuery = {
            code: authCreateQueryV1Fixture.code,
          };

          expect(
            userCodePersistenceOuptutPortMock.findOne,
          ).toHaveBeenCalledTimes(1);
          expect(
            userCodePersistenceOuptutPortMock.findOne,
          ).toHaveBeenCalledWith(expectedUserCodeFindQuery);
        });

        it('should not call jwtServiceMock.create()', () => {
          expect(jwtServiceMock.create).not.toHaveBeenCalled();
        });

        it('should throw an AppError', () => {
          const expected: Partial<AppError> = {
            kind: AppErrorKind.missingCredentials,
            message: 'Invalid credentials',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });

      describe('when called, userCodePersistenceOuptutPortMock.findOne() returns UserCode and userPersistenceOuptutPortMock.findOne() returns undefined', () => {
        let userCodeFixture: UserCode;

        let result: unknown;

        beforeAll(async () => {
          userCodeFixture = UserCodeFixtures.any;

          userCodePersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            userCodeFixture,
          );

          userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await authManagementInputPort.create(authCreateQueryV1Fixture);
          } catch (error) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userCodePersistenceOuptutPort.findOne()', () => {
          const expectedUserCodeFindQuery: UserCodeFindQuery = {
            code: authCreateQueryV1Fixture.code,
          };

          expect(
            userCodePersistenceOuptutPortMock.findOne,
          ).toHaveBeenCalledTimes(1);
          expect(
            userCodePersistenceOuptutPortMock.findOne,
          ).toHaveBeenCalledWith(expectedUserCodeFindQuery);
        });

        it('should call userPersistenceOuptutPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            id: userCodeFixture.userId,
          };

          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should not call jwtServiceMock.create()', () => {
          expect(jwtServiceMock.create).not.toHaveBeenCalled();
        });

        it('should throw an AppError', () => {
          const expected: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'UserCode found, but no User associated was found',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });

      describe('when called, userCodePersistenceOuptutPortMock.findOne() returns UserCode and userPersistenceOuptutPortMock.findOne() returns User', () => {
        let jwtFixture: string;
        let userFixture: User;
        let userCodeFixture: UserCode;

        let result: unknown;

        beforeAll(async () => {
          jwtFixture = 'jwt fixture';
          userFixture = UserFixtures.any;
          userCodeFixture = UserCodeFixtures.any;

          userCodePersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            userCodeFixture,
          );

          userPersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );

          jwtServiceMock.create.mockResolvedValueOnce(jwtFixture);

          result = await authManagementInputPort.create(
            authCreateQueryV1Fixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userCodePersistenceOuptutPort.findOne()', () => {
          const expectedUserCodeFindQuery: UserCodeFindQuery = {
            code: authCreateQueryV1Fixture.code,
          };

          expect(
            userCodePersistenceOuptutPortMock.findOne,
          ).toHaveBeenCalledTimes(1);
          expect(
            userCodePersistenceOuptutPortMock.findOne,
          ).toHaveBeenCalledWith(expectedUserCodeFindQuery);
        });

        it('should call userPersistenceOuptutPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            id: userCodeFixture.userId,
          };

          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOuptutPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should call jwtServiceMock.create()', () => {
          const expectedUserJwtPayload: Partial<UserJwtPayload> = {
            sub: userFixture.id,
          };

          expect(jwtServiceMock.create).toHaveBeenCalledTimes(1);
          expect(jwtServiceMock.create).toHaveBeenCalledWith(
            expectedUserJwtPayload,
          );
        });

        it('should return AuthV1', () => {
          const expected: apiModels.AuthV1 = {
            jwt: jwtFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
