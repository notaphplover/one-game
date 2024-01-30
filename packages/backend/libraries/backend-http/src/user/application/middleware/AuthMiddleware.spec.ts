import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { JwtService } from '@cornie-js/backend-jwt';

import { AuthKind } from '../../../auth/application/models/AuthKind';
import { AuthRequestContextHolder } from '../../../auth/application/models/AuthRequestContextHolder';
import { BackendServiceAuth } from '../../../auth/application/models/BackendServiceAuth';
import { UserAuth } from '../../../auth/application/models/UserAuth';
import { Request } from '../../../http/application/models/Request';
import { requestContextProperty } from '../../../http/application/models/requestContextProperty';
import { Response } from '../../../http/application/models/Response';
import { ResponseWithBody } from '../../../http/application/models/ResponseWithBody';
import { AuthMiddleware } from './AuthMiddleware';

class AuthMiddlewareMock extends AuthMiddleware<Record<string, unknown>> {
  readonly #findUserMock: jest.Mock<
    (id: string) => Promise<apiModels.UserV1 | undefined>
  >;
  readonly #getUserIdMock: jest.Mock<
    (jwtPayload: Record<string, unknown>) => string
  >;

  constructor(
    backendServicesSecret: string,
    jwtService: JwtService<Record<string, unknown>>,
    findUserMock: jest.Mock<
      (id: string) => Promise<apiModels.UserV1 | undefined>
    >,
    getUserIdMock: jest.Mock<(jwtPayload: Record<string, unknown>) => string>,
  ) {
    super(backendServicesSecret, jwtService);

    this.#findUserMock = findUserMock;
    this.#getUserIdMock = getUserIdMock;
  }

  protected override async _findUser(
    id: string,
  ): Promise<apiModels.UserV1 | undefined> {
    return this.#findUserMock(id);
  }

  protected override _getUserId(jwtPayload: Record<string, unknown>): string {
    return this.#getUserIdMock(jwtPayload);
  }
}

describe(AuthMiddleware.name, () => {
  let backendServicesSecretFixture: string;
  let jwtServiceMock: jest.Mocked<JwtService<Record<string, unknown>>>;
  let findUserMock: jest.Mock<
    (id: string) => Promise<apiModels.UserV1 | undefined>
  >;
  let getUserIdMock: jest.Mock<(jwtPayload: Record<string, unknown>) => string>;

  let authMiddlewareMock: AuthMiddlewareMock;

  beforeAll(() => {
    backendServicesSecretFixture = 'backend-services-secret-fixture';
    jwtServiceMock = {
      parse: jest.fn(),
    } as Partial<
      jest.Mocked<JwtService<Record<string, unknown>>>
    > as jest.Mocked<JwtService<Record<string, unknown>>>;

    findUserMock = jest.fn();

    getUserIdMock = jest.fn();

    authMiddlewareMock = new AuthMiddlewareMock(
      backendServicesSecretFixture,
      jwtServiceMock,
      findUserMock,
      getUserIdMock,
    );
  });

  describe('.handle', () => {
    let haltMock: jest.Mock<
      (response: Response | ResponseWithBody<unknown>) => void
    >;

    beforeAll(() => {
      haltMock = jest.fn();
    });

    describe.each<[string, Request, Partial<AppError>]>([
      [
        'undefined',
        {
          headers: {},
          query: {},
          urlParameters: {},
        },
        {
          kind: AppErrorKind.missingCredentials,
          message: 'No authorization header was found',
        },
      ],
      [
        'no bearer',
        {
          headers: {
            authorization: 'Non bearer token',
          },
          query: {},
          urlParameters: {},
        },
        {
          kind: AppErrorKind.missingCredentials,
          message: 'No Bearer authorization header was found',
        },
      ],
    ])(
      'having a wrong header (%s)',
      (
        _: string,
        requestFixture: Request,
        errorProperties: Partial<AppError>,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(async () => {
            try {
              await authMiddlewareMock.handle(requestFixture, haltMock);
            } catch (error: unknown) {
              result = error;
            }
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should throw an Error', () => {
            expect(result).toBeInstanceOf(AppError);
            expect(result).toStrictEqual(
              expect.objectContaining(errorProperties),
            );
          });
        });
      },
    );

    describe('having a bearer authorization header equals to backend services secret', () => {
      describe('when called', () => {
        let requestFixture: Request;

        beforeAll(async () => {
          requestFixture = {
            headers: {
              authorization: `Bearer ${backendServicesSecretFixture}`,
            },
            query: {},
            urlParameters: {},
          };

          await authMiddlewareMock.handle(requestFixture, haltMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should place auth in the request', () => {
          const expectedAuth: BackendServiceAuth = {
            kind: AuthKind.backendService,
          };

          expect(
            (requestFixture as Request & AuthRequestContextHolder)[
              requestContextProperty
            ].auth,
          ).toStrictEqual(expectedAuth);
        });
      });
    });

    describe('having a bearer authorization header different than backend services secret', () => {
      let jwtFixture: string;

      beforeAll(() => {
        jwtFixture = 'token';
      });

      describe('when called, and userManagementInputPort.findOne() returns a UserV1', () => {
        let requestFixture: Request;

        let jwtPayloadFixture: Record<string, unknown>;
        let userIdFixture: string;
        let userV1Fixture: apiModels.UserV1;

        beforeAll(async () => {
          requestFixture = {
            headers: {
              authorization: `Bearer ${jwtFixture}`,
            },
            query: {},
            urlParameters: {},
          };

          jwtPayloadFixture = { [Symbol()]: Symbol() };

          userIdFixture = 'idFixture';

          userV1Fixture = {
            active: true,
            id: 'id',
            name: 'name',
          };

          jwtServiceMock.parse.mockResolvedValueOnce(jwtPayloadFixture);
          getUserIdMock.mockReturnValueOnce(userIdFixture);
          findUserMock.mockResolvedValueOnce(userV1Fixture);

          await authMiddlewareMock.handle(requestFixture, haltMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call jwtService.parse()', () => {
          expect(jwtServiceMock.parse).toHaveBeenCalledTimes(1);
          expect(jwtServiceMock.parse).toHaveBeenCalledWith(jwtFixture);
        });

        it('should call getUserId()', () => {
          expect(getUserIdMock).toHaveBeenCalledTimes(1);
          expect(getUserIdMock).toHaveBeenCalledWith(jwtPayloadFixture);
        });

        it('should call findUser()', () => {
          expect(findUserMock).toHaveBeenCalledTimes(1);
          expect(findUserMock).toHaveBeenCalledWith(userIdFixture);
        });

        it('should place auth in the request', () => {
          const expectedAuth: UserAuth = {
            kind: AuthKind.user,
            user: userV1Fixture,
          };

          expect(
            (requestFixture as Request & AuthRequestContextHolder)[
              requestContextProperty
            ].auth,
          ).toStrictEqual(expectedAuth);
        });
      });

      describe('when called, and userManagementInputPort.findOne() returns undefined', () => {
        let result: unknown;

        let requestFixture: Request;

        let jwtPayloadFixture: Record<string, unknown>;
        let userIdFixture: string;

        beforeAll(async () => {
          requestFixture = {
            headers: {
              authorization: `Bearer ${jwtFixture}`,
            },
            query: {},
            urlParameters: {},
          };

          jwtPayloadFixture = { [Symbol()]: Symbol() };

          userIdFixture = 'idFixture';

          jwtServiceMock.parse.mockResolvedValueOnce(jwtPayloadFixture);
          getUserIdMock.mockReturnValueOnce(userIdFixture);
          findUserMock.mockResolvedValueOnce(undefined);

          try {
            await authMiddlewareMock.handle(requestFixture, haltMock);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call jwtService.parse()', () => {
          expect(jwtServiceMock.parse).toHaveBeenCalledTimes(1);
          expect(jwtServiceMock.parse).toHaveBeenCalledWith(jwtFixture);
        });

        it('should call getUserId()', () => {
          expect(getUserIdMock).toHaveBeenCalledTimes(1);
          expect(getUserIdMock).toHaveBeenCalledWith(jwtPayloadFixture);
        });

        it('should call findUser()', () => {
          expect(findUserMock).toHaveBeenCalledTimes(1);
          expect(findUserMock).toHaveBeenCalledWith(userIdFixture);
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.invalidCredentials,
            message: 'No user was found matching current credentials',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });
});
