import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { HttpStatus } from '@nestjs/common';

import { CreateAuthMutationResolver } from './CreateAuthMutationResolver';

describe(CreateAuthMutationResolver.name, () => {
  let httpClientMock: jest.Mocked<HttpClient>;

  let createAuthMutationResolver: CreateAuthMutationResolver;

  beforeAll(() => {
    httpClientMock = {
      createAuth: jest.fn(),
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    createAuthMutationResolver = new CreateAuthMutationResolver(httpClientMock);
  });

  describe('.createAuthByCode', () => {
    let codeFixture: string;

    beforeAll(() => {
      codeFixture = 'code-fixture';
    });

    describe('when called, and httpClient.createAuth() returns an OK response', () => {
      let authV1: apiModels.AuthV1;
      let requestFixture: Request;

      let result: unknown;

      beforeAll(async () => {
        authV1 = {
          jwt: 'jwt fixture',
        };

        requestFixture = {
          headers: {
            foo: 'bar',
          },
          query: {},
          urlParameters: {},
        };

        httpClientMock.createAuth.mockResolvedValueOnce({
          body: authV1,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        result = await createAuthMutationResolver.createAuthByCode(
          undefined,
          {
            codeAuthCreateInput: {
              code: codeFixture,
            },
          },
          requestFixture,
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
          requestFixture.headers,
          expectedBody,
        );
      });

      it('should return AuthV1', () => {
        expect(result).toBe(authV1);
      });
    });

    describe('when called, and httpClient.createAuth() returns an BAD_REQUEST response', () => {
      let errorV1: apiModels.ErrorV1;
      let requestFixture: Request;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        requestFixture = {
          headers: {
            foo: 'bar',
          },
          query: {},
          urlParameters: {},
        };

        httpClientMock.createAuth.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.BAD_REQUEST,
        });

        try {
          await createAuthMutationResolver.createAuthByCode(
            undefined,
            {
              codeAuthCreateInput: {
                code: codeFixture,
              },
            },
            requestFixture,
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
          requestFixture.headers,
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
      let requestFixture: Request;

      let result: unknown;

      beforeAll(async () => {
        authV1 = {
          jwt: 'jwt fixture',
        };

        requestFixture = {
          headers: {
            foo: 'bar',
          },
          query: {},
          urlParameters: {},
        };

        httpClientMock.createAuth.mockResolvedValueOnce({
          body: authV1,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        result = await createAuthMutationResolver.createAuthByCredentials(
          undefined,
          {
            emailPasswordAuthCreateInput: {
              email: emailFixture,
              password: passwordFixture,
            },
          },
          requestFixture,
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
          requestFixture.headers,
          expectedBody,
        );
      });

      it('should return AuthV1', () => {
        expect(result).toBe(authV1);
      });
    });

    describe('when called, and httpClient.createAuth() returns an BAD_REQUEST response', () => {
      let errorV1: apiModels.ErrorV1;
      let requestFixture: Request;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        requestFixture = {
          headers: {
            foo: 'bar',
          },
          query: {},
          urlParameters: {},
        };

        httpClientMock.createAuth.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.BAD_REQUEST,
        });

        try {
          await createAuthMutationResolver.createAuthByCredentials(
            undefined,
            {
              emailPasswordAuthCreateInput: {
                email: emailFixture,
                password: passwordFixture,
              },
            },
            requestFixture,
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
          requestFixture.headers,
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
