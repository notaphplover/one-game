import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient, Response } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { HttpStatus } from '@nestjs/common';

import { Context } from '../../../foundation/graphql/application/models/Context';
import { UserQueryResolver } from './UserQueryResolver';

describe(UserQueryResolver.name, () => {
  let httpClientMock: jest.Mocked<HttpClient>;

  let userQueryResolver: UserQueryResolver;

  beforeAll(() => {
    httpClientMock = {
      getUser: jest.fn(),
      getUserMe: jest.fn(),
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    userQueryResolver = new UserQueryResolver(httpClientMock);
  });

  describe('.userById', () => {
    describe('when called, and httpClient.getUser() returns a Response with status code 200', () => {
      let firstArgFixture: unknown;
      let argsFixture: graphqlModels.UserQueryUserByIdArgs;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.UserV1,
        HttpStatus.OK
      >;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {
          id: 'user-id',
        };
        contextFixture = {
          request: { headers: {}, query: {}, urlParameters: {} },
        } as Partial<Context> as Context;

        responseFixture = {
          body: {
            active: false,
            id: 'id-fixture',
            name: 'name',
          },
          headers: {},
          statusCode: HttpStatus.OK,
        };

        httpClientMock.getUser.mockResolvedValueOnce(responseFixture);

        result = await userQueryResolver.userById(
          firstArgFixture,
          argsFixture,
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.getUser()', () => {
        expect(httpClientMock.getUser).toHaveBeenCalledTimes(1);
        expect(httpClientMock.getUser).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            userId: argsFixture.id,
          },
        );
      });

      it('should return response body', () => {
        expect(result).toBe(responseFixture.body);
      });
    });

    describe('when called, and httpClient.getUser() returns a Response with status code 401', () => {
      let firstArgFixture: unknown;
      let argsFixture: graphqlModels.UserQueryUserByIdArgs;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.ErrorV1,
        HttpStatus.UNAUTHORIZED
      >;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {
          id: 'user-id',
        };
        contextFixture = {
          request: { headers: {}, query: {}, urlParameters: {} },
        } as Partial<Context> as Context;

        responseFixture = {
          body: {
            description: 'Error description fixture',
          },
          headers: {},
          statusCode: HttpStatus.UNAUTHORIZED,
        };

        httpClientMock.getUser.mockResolvedValueOnce(responseFixture);

        try {
          await userQueryResolver.userById(
            firstArgFixture,
            argsFixture,
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.getUser()', () => {
        expect(httpClientMock.getUser).toHaveBeenCalledTimes(1);
        expect(httpClientMock.getUser).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            userId: argsFixture.id,
          },
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.missingCredentials,
          message: responseFixture.body.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and httpClient.getUser() returns a Response with status code 404', () => {
      let firstArgFixture: unknown;
      let argsFixture: graphqlModels.UserQueryUserByIdArgs;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.ErrorV1,
        HttpStatus.NOT_FOUND
      >;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {
          id: 'user-id',
        };
        contextFixture = {
          request: { headers: {}, query: {}, urlParameters: {} },
        } as Partial<Context> as Context;

        responseFixture = {
          body: {
            description: 'Error description fixture',
          },
          headers: {},
          statusCode: HttpStatus.NOT_FOUND,
        };

        httpClientMock.getUser.mockResolvedValueOnce(responseFixture);

        result = await userQueryResolver.userById(
          firstArgFixture,
          argsFixture,
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.getUser()', () => {
        expect(httpClientMock.getUser).toHaveBeenCalledTimes(1);
        expect(httpClientMock.getUser).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            userId: argsFixture.id,
          },
        );
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });
    });
  });

  describe('.userMe', () => {
    describe('when called, and httpClient.getUserMe() returns a Response with status code 200', () => {
      let firstArgFixture: unknown;
      let argsFixture: Record<string, string>;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.UserV1,
        HttpStatus.OK
      >;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {};
        contextFixture = {
          request: { headers: {}, query: {}, urlParameters: {} },
        } as Partial<Context> as Context;

        responseFixture = {
          body: {
            active: false,
            id: 'id-fixture',
            name: 'name',
          },
          headers: {},
          statusCode: HttpStatus.OK,
        };

        httpClientMock.getUserMe.mockResolvedValueOnce(responseFixture);

        result = await userQueryResolver.userMe(
          firstArgFixture,
          argsFixture,
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.getUserMe()', () => {
        expect(httpClientMock.getUserMe).toHaveBeenCalledTimes(1);
        expect(httpClientMock.getUserMe).toHaveBeenCalledWith(
          contextFixture.request.headers,
        );
      });

      it('should return response body', () => {
        expect(result).toBe(responseFixture.body);
      });
    });

    describe('when called, and httpClient.getUserMe() returns a Response with status code 401', () => {
      let firstArgFixture: unknown;
      let argsFixture: Record<string, string>;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.ErrorV1,
        HttpStatus.UNAUTHORIZED
      >;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {};
        contextFixture = {
          request: { headers: {}, query: {}, urlParameters: {} },
        } as Partial<Context> as Context;

        responseFixture = {
          body: {
            description: 'Error description fixture',
          },
          headers: {},
          statusCode: HttpStatus.UNAUTHORIZED,
        };

        httpClientMock.getUserMe.mockResolvedValueOnce(responseFixture);

        try {
          await userQueryResolver.userMe(
            firstArgFixture,
            argsFixture,
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.getUserMe()', () => {
        expect(httpClientMock.getUserMe).toHaveBeenCalledTimes(1);
        expect(httpClientMock.getUserMe).toHaveBeenCalledWith(
          contextFixture.request.headers,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.missingCredentials,
          message: responseFixture.body.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and httpClient.getUserMe() returns a Response with status code 403', () => {
      let firstArgFixture: unknown;
      let argsFixture: Record<string, string>;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.ErrorV1,
        HttpStatus.FORBIDDEN
      >;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {};
        contextFixture = {
          request: { headers: {}, query: {}, urlParameters: {} },
        } as Partial<Context> as Context;

        responseFixture = {
          body: {
            description: 'Error description fixture',
          },
          headers: {},
          statusCode: HttpStatus.FORBIDDEN,
        };

        httpClientMock.getUserMe.mockResolvedValueOnce(responseFixture);

        try {
          await userQueryResolver.userMe(
            firstArgFixture,
            argsFixture,
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.getUserMe()', () => {
        expect(httpClientMock.getUserMe).toHaveBeenCalledTimes(1);
        expect(httpClientMock.getUserMe).toHaveBeenCalledWith(
          contextFixture.request.headers,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.invalidCredentials,
          message: responseFixture.body.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
