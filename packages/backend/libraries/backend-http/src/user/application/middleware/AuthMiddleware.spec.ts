import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { JwtService } from '@one-game-js/backend-jwt';

import { Request } from '../../../http/application/models/Request';
import { Response } from '../../../http/application/models/Response';
import { ResponseWithBody } from '../../../http/application/models/ResponseWithBody';
import { requestContextProperty } from '../../../index';
import { RequestUserContextHolder } from '../models/RequestUserContextHolder';
import { UserManagementInputPort } from '../ports/input/UserManagementInputPort';
import { AuthMiddleware } from './AuthMiddleware';

class AuthMiddlewareMock extends AuthMiddleware<Record<string, unknown>> {
  readonly #getUserIdMock: jest.Mock<
    (jwtPayload: Record<string, unknown>) => string
  >;

  constructor(
    jwtService: JwtService<Record<string, unknown>>,
    userManagementInputPort: UserManagementInputPort,
    getUserIdMock: jest.Mock<(jwtPayload: Record<string, unknown>) => string>,
  ) {
    super(jwtService, userManagementInputPort);

    this.#getUserIdMock = getUserIdMock;
  }

  protected _getUserId(jwtPayload: Record<string, unknown>): string {
    return this.#getUserIdMock(jwtPayload);
  }
}

describe(AuthMiddleware.name, () => {
  let jwtServiceMock: jest.Mocked<JwtService<Record<string, unknown>>>;
  let userManagementInputPortMock: jest.Mocked<UserManagementInputPort>;
  let getUserIdMock: jest.Mock<(jwtPayload: Record<string, unknown>) => string>;

  let authMiddlewareMock: AuthMiddlewareMock;

  beforeAll(() => {
    jwtServiceMock = {
      parse: jest.fn(),
    } as Partial<
      jest.Mocked<JwtService<Record<string, unknown>>>
    > as jest.Mocked<JwtService<Record<string, unknown>>>;

    userManagementInputPortMock = {
      findOne: jest.fn(),
    };

    getUserIdMock = jest.fn();

    authMiddlewareMock = new AuthMiddlewareMock(
      jwtServiceMock,
      userManagementInputPortMock,
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
            } catch (error) {
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

    describe('having a bearer authorization header', () => {
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
            id: 'id',
            name: 'name',
          };

          jwtServiceMock.parse.mockResolvedValueOnce(jwtPayloadFixture);
          getUserIdMock.mockReturnValueOnce(userIdFixture);
          userManagementInputPortMock.findOne.mockResolvedValueOnce(
            userV1Fixture,
          );

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

        it('should call userManagementInputPort.findOne()', () => {
          expect(userManagementInputPortMock.findOne).toHaveBeenCalledTimes(1);
          expect(userManagementInputPortMock.findOne).toHaveBeenCalledWith(
            userIdFixture,
          );
        });

        it('should place userV1 in the request', () => {
          expect(
            (requestFixture as Request & RequestUserContextHolder)[
              requestContextProperty
            ].user,
          ).toBe(userV1Fixture);
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
          userManagementInputPortMock.findOne.mockResolvedValueOnce(undefined);

          try {
            await authMiddlewareMock.handle(requestFixture, haltMock);
          } catch (error) {
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

        it('should call userManagementInputPort.findOne()', () => {
          expect(userManagementInputPortMock.findOne).toHaveBeenCalledTimes(1);
          expect(userManagementInputPortMock.findOne).toHaveBeenCalledWith(
            userIdFixture,
          );
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
