import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { HttpStatus } from '@nestjs/common';

import { Context } from '../../../foundation/graphql/application/models/Context';
import { AuthMutationResolver } from './AuthMutationResolver';

describe(AuthMutationResolver.name, () => {
  let httpClientMock: jest.Mocked<HttpClient>;

  let authMutationResolver: AuthMutationResolver;

  beforeAll(() => {
    httpClientMock = {
      createAuth: jest.fn(),
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    authMutationResolver = new AuthMutationResolver(httpClientMock);
  });

  describe('.createAuthByCode', () => {
    let codeFixture: string;

    beforeAll(() => {
      codeFixture = 'code-fixture';
    });

    describe('when called, and httpClient.createAuth() returns an OK response', () => {
      let authV1: apiModels.AuthV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        authV1 = {
          jwt: 'jwt fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.createAuth.mockResolvedValueOnce({
          body: authV1,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        result = await authMutationResolver.createAuthByCode(
          undefined,
          {
            codeAuthCreateInput: {
              code: codeFixture,
            },
          },
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createAuth()', () => {
        const expectedBody: apiModels.AuthCreateQueryV1 = {
          code: codeFixture,
        };

        expect(httpClientMock.createAuth).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createAuth).toHaveBeenCalledWith(
          contextFixture.request.headers,
          expectedBody,
        );
      });

      it('should return AuthV1', () => {
        expect(result).toBe(authV1);
      });
    });

    describe('when called, and httpClient.createAuth() returns an BAD_REQUEST response', () => {
      let errorV1: apiModels.ErrorV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.createAuth.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.BAD_REQUEST,
        });

        try {
          await authMutationResolver.createAuthByCode(
            undefined,
            {
              codeAuthCreateInput: {
                code: codeFixture,
              },
            },
            contextFixture,
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createAuth()', () => {
        const expectedBody: apiModels.AuthCreateQueryV1 = {
          code: codeFixture,
        };

        expect(httpClientMock.createAuth).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createAuth).toHaveBeenCalledWith(
          contextFixture.request.headers,
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: errorV1.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('.createAuthByCredentials', () => {
    let emailFixture: string;
    let passwordFixture: string;

    beforeAll(() => {
      emailFixture = 'email-fixture';
      passwordFixture = 'password-fixture';
    });

    describe('when called, and httpClient.createAuth() returns an OK response', () => {
      let authV1: apiModels.AuthV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        authV1 = {
          jwt: 'jwt fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.createAuth.mockResolvedValueOnce({
          body: authV1,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        result = await authMutationResolver.createAuthByCredentials(
          undefined,
          {
            emailPasswordAuthCreateInput: {
              email: emailFixture,
              password: passwordFixture,
            },
          },
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createAuth()', () => {
        const expectedBody: apiModels.AuthCreateQueryV1 = {
          email: emailFixture,
          password: passwordFixture,
        };

        expect(httpClientMock.createAuth).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createAuth).toHaveBeenCalledWith(
          contextFixture.request.headers,
          expectedBody,
        );
      });

      it('should return AuthV1', () => {
        expect(result).toBe(authV1);
      });
    });

    describe('when called, and httpClient.createAuth() returns an BAD_REQUEST response', () => {
      let errorV1: apiModels.ErrorV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.createAuth.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.BAD_REQUEST,
        });

        try {
          await authMutationResolver.createAuthByCredentials(
            undefined,
            {
              emailPasswordAuthCreateInput: {
                email: emailFixture,
                password: passwordFixture,
              },
            },
            contextFixture,
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createAuth()', () => {
        const expectedBody: apiModels.AuthCreateQueryV1 = {
          email: emailFixture,
          password: passwordFixture,
        };

        expect(httpClientMock.createAuth).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createAuth).toHaveBeenCalledWith(
          contextFixture.request.headers,
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: errorV1.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
