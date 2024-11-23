import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { JwtService } from '@cornie-js/backend-app-jwt';
import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  RefreshToken,
  RefreshTokenCreateQuery,
  RefreshTokenFindQuery,
  RefreshTokenUpdateQuery,
} from '@cornie-js/backend-user-domain/tokens';
import { RefreshTokenFixtures } from '@cornie-js/backend-user-domain/tokens/fixtures';
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
import { RefreshTokenJwtPayload } from '../../../../tokens/application/models/RefreshTokenJwtPayload';
import { RefreshTokenPersistenceOutputPort } from '../../../../tokens/application/ports/output/RefreshTokenPersistenceOutputPort';
import { UserCodePersistenceOutputPort } from '../../../../users/application/ports/output/UserCodePersistenceOutputPort';
import { UserPersistenceOutputPort } from '../../../../users/application/ports/output/UserPersistenceOutputPort';
import { AuthManagementInputPort } from './AuthManagementInputPort';

describe(AuthManagementInputPort.name, () => {
  let bcryptHashProviderOutputPortMock: jest.Mocked<BcryptHashProviderOutputPort>;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let refreshTokenPersistenceOutputPortMock: jest.Mocked<RefreshTokenPersistenceOutputPort>;
  let userCanCreateAuthSpecMock: jest.Mocked<UserCanCreateAuthSpec>;
  let userCodePersistenceOuptutPortMock: jest.Mocked<UserCodePersistenceOutputPort>;
  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let authManagementInputPort: AuthManagementInputPort;

  beforeAll(() => {
    bcryptHashProviderOutputPortMock = {
      verify: jest.fn(),
    } as Partial<
      jest.Mocked<BcryptHashProviderOutputPort>
    > as jest.Mocked<BcryptHashProviderOutputPort>;
    jwtServiceMock = {
      create: jest.fn(),
    } as Partial<jest.Mocked<JwtService>> as jest.Mocked<JwtService>;
    refreshTokenPersistenceOutputPortMock = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };
    userCanCreateAuthSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    userCodePersistenceOuptutPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserCodePersistenceOutputPort>
    > as jest.Mocked<UserCodePersistenceOutputPort>;
    userPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserPersistenceOutputPort>
    > as jest.Mocked<UserPersistenceOutputPort>;
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    authManagementInputPort = new AuthManagementInputPort(
      bcryptHashProviderOutputPortMock,
      jwtServiceMock,
      refreshTokenPersistenceOutputPortMock,
      userCanCreateAuthSpecMock,
      userCodePersistenceOuptutPortMock,
      userPersistenceOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.createByQueryV2', () => {
    describe('having an LoginAuthCreateQueryV2', () => {
      let loginAuthCreateQueryV2: apiModels.LoginAuthCreateQueryV2;

      beforeAll(() => {
        loginAuthCreateQueryV2 = {
          email: 'mail@example.com',
          kind: 'login',
          password: 'sample-password',
        };
      });

      describe('when called, and userPersistenceOuptutPortMock.findOne() returns undefined', () => {
        let result: unknown;

        beforeAll(async () => {
          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await authManagementInputPort.createByQueryV2(
              loginAuthCreateQueryV2,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userPersistenceOuptutPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            email: loginAuthCreateQueryV2.email,
          };

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
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

      describe('when called, and userPersistenceOuptutPortMock.findOne() returns User and userCanCreateAuthSpec.isSatisfiedBy() returns true', () => {
        let userFixture: User;
        let familyIdFixture: string;
        let accessTokenFixture: string;
        let refreshTokenFixture: string;
        let refreshTokenIdFixture: string;

        let result: unknown;

        beforeAll(async () => {
          userFixture = UserFixtures.any;
          familyIdFixture = '8c21fe5a-58f4-467a-bd14-9b3e645d1af5';
          accessTokenFixture = 'accessTokenFixture';
          refreshTokenFixture = 'refreshTokenFixture';
          refreshTokenIdFixture = '321ef446-f040-47b1-b2cc-19384dc0263e';

          userCanCreateAuthSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );

          bcryptHashProviderOutputPortMock.verify.mockResolvedValueOnce(true);

          uuidProviderOutputPortMock.generateV4
            .mockReturnValueOnce(familyIdFixture)
            .mockReturnValueOnce(refreshTokenIdFixture);

          jwtServiceMock.create
            .mockResolvedValueOnce(accessTokenFixture)
            .mockResolvedValueOnce(refreshTokenFixture);

          result = await authManagementInputPort.createByQueryV2(
            loginAuthCreateQueryV2,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userPersistenceOuptutPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            email: loginAuthCreateQueryV2.email,
          };

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
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
            loginAuthCreateQueryV2.password,
            userFixture.passwordHash,
          );
        });

        it('should call uuidProviderOutputPort.generateV4', () => {
          expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(
            2,
          );
          expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
        });

        it('should call jwtServiceMock.create()', () => {
          expect(jwtServiceMock.create).toHaveBeenCalledTimes(2);
          expect(jwtServiceMock.create).toHaveBeenNthCalledWith(1, {
            sub: userFixture.id,
          });
          expect(jwtServiceMock.create).toHaveBeenNthCalledWith(2, {
            familyId: familyIdFixture,
            id: refreshTokenIdFixture,
            sub: userFixture.id,
          });
        });

        it('should call refreshTokenPersistenceOutputPort.create()', () => {
          const expected: RefreshTokenCreateQuery = {
            active: true,
            family: familyIdFixture,
            id: refreshTokenIdFixture,
            token: refreshTokenFixture,
          };

          expect(
            refreshTokenPersistenceOutputPortMock.create,
          ).toHaveBeenCalledTimes(1);
          expect(
            refreshTokenPersistenceOutputPortMock.create,
          ).toHaveBeenCalledWith(expected);
        });

        it('should return an AuthV1', () => {
          const expected: apiModels.AuthV2 = {
            accessToken: accessTokenFixture,
            refreshToken: refreshTokenFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and userPersistenceOuptutPortMock.findOne() returns UserV1 and userCanCreateAuthSpec.isSatisfiedBy() returns false', () => {
        let userFixture: User;

        let result: unknown;

        beforeAll(async () => {
          userFixture = UserFixtures.any;

          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );

          userCanCreateAuthSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          try {
            await authManagementInputPort.createByQueryV2(
              loginAuthCreateQueryV2,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userPersistenceOuptutPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            email: loginAuthCreateQueryV2.email,
          };

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
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

          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );
          userCanCreateAuthSpecMock.isSatisfiedBy.mockReturnValueOnce(true);
          bcryptHashProviderOutputPortMock.verify.mockResolvedValueOnce(false);

          try {
            await authManagementInputPort.createByQueryV2(
              loginAuthCreateQueryV2,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userPersistenceOuptutPort.findOne()', () => {
          const expectedUserFindQuery: UserFindQuery = {
            email: loginAuthCreateQueryV2.email,
          };

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should call bcryptHashProviderOutputPort.verify()', () => {
          expect(bcryptHashProviderOutputPortMock.verify).toHaveBeenCalledTimes(
            1,
          );
          expect(bcryptHashProviderOutputPortMock.verify).toHaveBeenCalledWith(
            loginAuthCreateQueryV2.password,
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

    describe('having an CodeAuthCreateQueryV2', () => {
      let authCreateQueryV2Fixture: apiModels.CodeAuthCreateQueryV2;

      beforeAll(() => {
        authCreateQueryV2Fixture = {
          code: 'qwertyuiop',
          kind: 'code',
        };
      });

      describe('when called, and userCodePersistenceOuptutPortMock.findOne() returns undefined', () => {
        let result: unknown;

        beforeAll(async () => {
          userCodePersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await authManagementInputPort.createByQueryV2(
              authCreateQueryV2Fixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userCodePersistenceOuptutPort.findOne()', () => {
          const expectedUserCodeFindQuery: UserCodeFindQuery = {
            code: authCreateQueryV2Fixture.code,
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

          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await authManagementInputPort.createByQueryV2(
              authCreateQueryV2Fixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userCodePersistenceOuptutPort.findOne()', () => {
          const expectedUserCodeFindQuery: UserCodeFindQuery = {
            code: authCreateQueryV2Fixture.code,
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

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
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
        let accessTokenFixture: string;
        let refreshTokenFixture: string;
        let refreshTokenIdFixture: string;
        let userFixture: User;
        let familyIdFixture: string;
        let userCodeFixture: UserCode;

        let result: unknown;

        beforeAll(async () => {
          accessTokenFixture = 'accessTokenFixture';
          refreshTokenFixture = 'refreshTokenFixture';
          refreshTokenIdFixture = '321ef446-f040-47b1-b2cc-19384dc0263e';
          userFixture = UserFixtures.any;
          familyIdFixture = '8c21fe5a-58f4-467a-bd14-9b3e645d1af5';
          userCodeFixture = UserCodeFixtures.any;

          userCodePersistenceOuptutPortMock.findOne.mockResolvedValueOnce(
            userCodeFixture,
          );

          userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            userFixture,
          );

          uuidProviderOutputPortMock.generateV4
            .mockReturnValueOnce(familyIdFixture)
            .mockReturnValueOnce(refreshTokenIdFixture);

          jwtServiceMock.create
            .mockResolvedValueOnce(accessTokenFixture)
            .mockResolvedValueOnce(refreshTokenFixture);

          result = await authManagementInputPort.createByQueryV2(
            authCreateQueryV2Fixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userCodePersistenceOuptutPort.findOne()', () => {
          const expectedUserCodeFindQuery: UserCodeFindQuery = {
            code: authCreateQueryV2Fixture.code,
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

          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expectedUserFindQuery,
          );
        });

        it('should call uuidProviderOutputPort.generateV4', () => {
          expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(
            2,
          );
          expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
        });

        it('should call jwtServiceMock.create()', () => {
          expect(jwtServiceMock.create).toHaveBeenCalledTimes(2);
          expect(jwtServiceMock.create).toHaveBeenNthCalledWith(1, {
            sub: userFixture.id,
          });
          expect(jwtServiceMock.create).toHaveBeenNthCalledWith(2, {
            familyId: familyIdFixture,
            id: refreshTokenIdFixture,
            sub: userFixture.id,
          });
        });

        it('should call refreshTokenPersistenceOutputPort.create()', () => {
          const expected: RefreshTokenCreateQuery = {
            active: true,
            family: familyIdFixture,
            id: refreshTokenIdFixture,
            token: refreshTokenFixture,
          };

          expect(
            refreshTokenPersistenceOutputPortMock.create,
          ).toHaveBeenCalledTimes(1);
          expect(
            refreshTokenPersistenceOutputPortMock.create,
          ).toHaveBeenCalledWith(expected);
        });

        it('should return AuthV2', () => {
          const expected: apiModels.AuthV2 = {
            accessToken: accessTokenFixture,
            refreshToken: refreshTokenFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('.createByRefreshTokenV2', () => {
    let refreshTokenJwtPayloadFixture: RefreshTokenJwtPayload;

    beforeAll(() => {
      refreshTokenJwtPayloadFixture = {
        aud: 'aud',
        familyId: 'family-id',
        iat: 1000,
        id: 'id',
        iss: 'iss',
        sub: 'sub',
      };
    });

    describe('when called, and userPersistenceOuptutPort.findOne() returns undefined and refreshTokenPersistenceOutputPort.find() returns an array with a single token', () => {
      let refreshTokenValueObjectFixture: RefreshToken;

      let result: unknown;

      beforeAll(async () => {
        refreshTokenValueObjectFixture = RefreshTokenFixtures.any;

        refreshTokenPersistenceOutputPortMock.find.mockResolvedValueOnce([
          refreshTokenValueObjectFixture,
        ]);
        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

        try {
          await authManagementInputPort.createByRefreshTokenV2(
            refreshTokenJwtPayloadFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call refreshTokenPersistenceOutputPort.find()', () => {
        const expected: RefreshTokenFindQuery = {
          active: true,
          date: {
            from: new Date(refreshTokenJwtPayloadFixture.iat * 1000),
          },
          familyId: refreshTokenJwtPayloadFixture.familyId,
          limit: 2,
        };

        expect(
          refreshTokenPersistenceOutputPortMock.find,
        ).toHaveBeenCalledTimes(1);
        expect(refreshTokenPersistenceOutputPortMock.find).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call userTokenPersistenceOutputPort.findOne()', () => {
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith({
          id: refreshTokenJwtPayloadFixture.sub,
        });
      });

      it('should throw an AppError', () => {
        const expectedErrorProprerties: Partial<AppError> = {
          kind: AppErrorKind.missingCredentials,
          message: 'Invalid credentials',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProprerties),
        );
      });
    });

    describe('when called, and userPersistenceOuptutPort.findOne() returns User and refreshTokenPersistenceOutputPort.find() returns an empty array', () => {
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;

        refreshTokenPersistenceOutputPortMock.find.mockResolvedValueOnce([]);
        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );

        try {
          await authManagementInputPort.createByRefreshTokenV2(
            refreshTokenJwtPayloadFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call refreshTokenPersistenceOutputPort.find()', () => {
        const expected: RefreshTokenFindQuery = {
          active: true,
          date: {
            from: new Date(refreshTokenJwtPayloadFixture.iat * 1000),
          },
          familyId: refreshTokenJwtPayloadFixture.familyId,
          limit: 2,
        };

        expect(
          refreshTokenPersistenceOutputPortMock.find,
        ).toHaveBeenCalledTimes(1);
        expect(refreshTokenPersistenceOutputPortMock.find).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call userTokenPersistenceOutputPort.findOne()', () => {
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith({
          id: refreshTokenJwtPayloadFixture.sub,
        });
      });

      it('should throw an AppError', () => {
        const expectedErrorProprerties: Partial<AppError> = {
          kind: AppErrorKind.missingCredentials,
          message: 'Invalid credentials',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProprerties),
        );
      });
    });

    describe('when called, and userPersistenceOuptutPort.findOne() returns User and refreshTokenPersistenceOutputPort.find() returns an array with a single token', () => {
      let accessTokenFixture: string;
      let refreshTokenFixture: string;
      let refreshTokenIdFixture: string;
      let refreshTokenValueObjectFixture: RefreshToken;
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        accessTokenFixture = 'access-token-fixture';
        refreshTokenFixture = 'refresh-token-fixture';
        refreshTokenIdFixture = 'refresh-token-id-fixture';

        refreshTokenValueObjectFixture = RefreshTokenFixtures.any;
        userFixture = UserFixtures.any;

        refreshTokenPersistenceOutputPortMock.find.mockResolvedValueOnce([
          refreshTokenValueObjectFixture,
        ]);
        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );

        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(
          refreshTokenIdFixture,
        );

        jwtServiceMock.create
          .mockResolvedValueOnce(accessTokenFixture)
          .mockResolvedValueOnce(refreshTokenFixture);

        result = await authManagementInputPort.createByRefreshTokenV2(
          refreshTokenJwtPayloadFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call refreshTokenPersistenceOutputPort.find()', () => {
        const expected: RefreshTokenFindQuery = {
          active: true,
          date: {
            from: new Date(refreshTokenJwtPayloadFixture.iat * 1000),
          },
          familyId: refreshTokenJwtPayloadFixture.familyId,
          limit: 2,
        };

        expect(
          refreshTokenPersistenceOutputPortMock.find,
        ).toHaveBeenCalledTimes(1);
        expect(refreshTokenPersistenceOutputPortMock.find).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call userTokenPersistenceOutputPort.findOne()', () => {
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith({
          id: refreshTokenJwtPayloadFixture.sub,
        });
      });

      it('should not call refreshTokenPersistenceOutputPort.update()', () => {
        expect(
          refreshTokenPersistenceOutputPortMock.update,
        ).not.toHaveBeenCalled();
      });

      it('should call uuidProviderOutputPort.generateV4', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(1);
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
      });

      it('should call jwtServiceMock.create()', () => {
        expect(jwtServiceMock.create).toHaveBeenCalledTimes(2);
        expect(jwtServiceMock.create).toHaveBeenNthCalledWith(1, {
          sub: userFixture.id,
        });
        expect(jwtServiceMock.create).toHaveBeenNthCalledWith(2, {
          familyId: refreshTokenJwtPayloadFixture.familyId,
          id: refreshTokenIdFixture,
          sub: userFixture.id,
        });
      });

      it('should call refreshTokenPersistenceOutputPort.create()', () => {
        const expected: RefreshTokenCreateQuery = {
          active: true,
          family: refreshTokenJwtPayloadFixture.familyId,
          id: refreshTokenIdFixture,
          token: refreshTokenFixture,
        };

        expect(
          refreshTokenPersistenceOutputPortMock.create,
        ).toHaveBeenCalledTimes(1);
        expect(
          refreshTokenPersistenceOutputPortMock.create,
        ).toHaveBeenCalledWith(expected);
      });

      it('should return AuthV2', () => {
        const expected: apiModels.AuthV2 = {
          accessToken: accessTokenFixture,
          refreshToken: refreshTokenFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and userPersistenceOuptutPort.findOne() returns User and refreshTokenPersistenceOutputPort.find() returns an array with more than one token', () => {
      let refreshTokenValueObjectFixture: RefreshToken;
      let userFixture: User;

      let result: unknown;

      beforeAll(async () => {
        refreshTokenValueObjectFixture = RefreshTokenFixtures.any;
        userFixture = UserFixtures.any;

        refreshTokenPersistenceOutputPortMock.find.mockResolvedValueOnce([
          refreshTokenValueObjectFixture,
          refreshTokenValueObjectFixture,
        ]);
        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );

        try {
          await authManagementInputPort.createByRefreshTokenV2(
            refreshTokenJwtPayloadFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call refreshTokenPersistenceOutputPort.find()', () => {
        const expected: RefreshTokenFindQuery = {
          active: true,
          date: {
            from: new Date(refreshTokenJwtPayloadFixture.iat * 1000),
          },
          familyId: refreshTokenJwtPayloadFixture.familyId,
          limit: 2,
        };

        expect(
          refreshTokenPersistenceOutputPortMock.find,
        ).toHaveBeenCalledTimes(1);
        expect(refreshTokenPersistenceOutputPortMock.find).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call userTokenPersistenceOutputPort.findOne()', () => {
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith({
          id: refreshTokenJwtPayloadFixture.sub,
        });
      });

      it('should call refreshTokenPersistenceOutputPort.update()', () => {
        const expected: RefreshTokenUpdateQuery = {
          active: false,
          findQuery: {
            active: true,
            date: {
              from: new Date(refreshTokenJwtPayloadFixture.iat * 1000),
            },
            familyId: refreshTokenJwtPayloadFixture.familyId,
          },
        };

        expect(
          refreshTokenPersistenceOutputPortMock.update,
        ).toHaveBeenCalledTimes(1);
        expect(
          refreshTokenPersistenceOutputPortMock.update,
        ).toHaveBeenCalledWith(expected);
      });

      it('should throw an AppError', () => {
        const expectedErrorProprerties: Partial<AppError> = {
          kind: AppErrorKind.missingCredentials,
          message: 'Invalid credentials',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProprerties),
        );
      });
    });
  });
});
