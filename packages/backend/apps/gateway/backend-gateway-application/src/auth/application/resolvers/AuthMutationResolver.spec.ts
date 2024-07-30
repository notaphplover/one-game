import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient, HttpClientEndpoints } from '@cornie-js/api-http-client';
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
      endpoints: {
        createAuthV2: jest.fn(),
      } as Partial<jest.Mocked<HttpClientEndpoints>>,
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    authMutationResolver = new AuthMutationResolver(httpClientMock);
  });

  describe('.createAuthByCode', () => {
    let codeFixture: string;

    beforeAll(() => {
      codeFixture = 'code-fixture';
    });

    describe('when called, and httpClient.endpoints.createAuthV2() returns an OK response', () => {
      let authV2Fixture: apiModels.AuthV2;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        authV2Fixture = {
          accessToken: 'access token fixture',
          refreshToken: 'refresh token fixture',
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

        httpClientMock.endpoints.createAuthV2.mockResolvedValueOnce({
          body: authV2Fixture,
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

      it('should call httpClient.endpoints.createAuthV2()', () => {
        const expectedBody: apiModels.AuthCreateQueryV2 = {
          code: codeFixture,
          kind: 'code',
        };

        expect(httpClientMock.endpoints.createAuthV2).toHaveBeenCalledTimes(1);
        expect(httpClientMock.endpoints.createAuthV2).toHaveBeenCalledWith(
          contextFixture.request.headers,
          expectedBody,
        );
      });

      it('should return Auth', () => {
        const expected: graphqlModels.Auth = {
          ...authV2Fixture,
          jwt: authV2Fixture.accessToken,
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and httpClient.endpoints.createAuthV2() returns an BAD_REQUEST response', () => {
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

        httpClientMock.endpoints.createAuthV2.mockResolvedValueOnce({
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
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.endpoints.createAuthV2()', () => {
        const expectedBody: apiModels.AuthCreateQueryV2 = {
          code: codeFixture,
          kind: 'code',
        };

        expect(httpClientMock.endpoints.createAuthV2).toHaveBeenCalledTimes(1);
        expect(httpClientMock.endpoints.createAuthV2).toHaveBeenCalledWith(
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

    describe('when called, and httpClient.endpoints.createAuthV2() returns an OK response', () => {
      let authV2Fixture: apiModels.AuthV2;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        authV2Fixture = {
          accessToken: 'access token fixture',
          refreshToken: 'refresh token fixture',
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

        httpClientMock.endpoints.createAuthV2.mockResolvedValueOnce({
          body: authV2Fixture,
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

      it('should call httpClient.endpoints.createAuthV2()', () => {
        const expectedBody: apiModels.AuthCreateQueryV2 = {
          email: emailFixture,
          kind: 'login',
          password: passwordFixture,
        };

        expect(httpClientMock.endpoints.createAuthV2).toHaveBeenCalledTimes(1);
        expect(httpClientMock.endpoints.createAuthV2).toHaveBeenCalledWith(
          contextFixture.request.headers,
          expectedBody,
        );
      });

      it('should return Auth', () => {
        const expected: graphqlModels.Auth = {
          ...authV2Fixture,
          jwt: authV2Fixture.accessToken,
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and httpClient.endpoints.createAuthV2() returns an BAD_REQUEST response', () => {
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

        httpClientMock.endpoints.createAuthV2.mockResolvedValueOnce({
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
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.endpoints.createAuthV2()', () => {
        const expectedBody: apiModels.AuthCreateQueryV2 = {
          email: emailFixture,
          kind: 'login',
          password: passwordFixture,
        };

        expect(httpClientMock.endpoints.createAuthV2).toHaveBeenCalledTimes(1);
        expect(httpClientMock.endpoints.createAuthV2).toHaveBeenCalledWith(
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
