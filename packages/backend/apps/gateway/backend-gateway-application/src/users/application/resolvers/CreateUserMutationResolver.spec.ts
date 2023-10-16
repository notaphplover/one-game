import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { HttpStatus } from '@nestjs/common';

import { CreateUserMutationResolver } from './CreateUserMutationResolver';

describe(CreateUserMutationResolver.name, () => {
  let httpClientMock: jest.Mocked<HttpClient>;

  let createUserMutationResolver: CreateUserMutationResolver;

  beforeAll(() => {
    httpClientMock = {
      createUser: jest.fn(),
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    createUserMutationResolver = new CreateUserMutationResolver(httpClientMock);
  });

  describe('.createUser', () => {
    let emailFixture: string;
    let nameFixture: string;
    let passwordFixture: string;

    beforeAll(() => {
      emailFixture = 'email-fixture';
      nameFixture = 'name-fixture';
      passwordFixture = 'password-fixture';
    });

    describe('when called, and httpClient.createUser() returns an OK response', () => {
      let userV1: apiModels.UserV1;
      let requestFixture: Request;

      let result: unknown;

      beforeAll(async () => {
        userV1 = {
          active: false,
          id: 'id-fixture',
          name: 'name',
        };

        requestFixture = {
          headers: {
            foo: 'bar',
          },
          query: {},
          urlParameters: {},
        };

        httpClientMock.createUser.mockResolvedValueOnce({
          body: userV1,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        result = await createUserMutationResolver.createUser(
          undefined,
          {
            userCreateInput: {
              email: emailFixture,
              name: nameFixture,
              password: passwordFixture,
            },
          },
          requestFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createUser()', () => {
        const expectedBody: apiModels.UserCreateQueryV1 = {
          email: emailFixture,
          name: nameFixture,
          password: passwordFixture,
        };

        expect(httpClientMock.createUser).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createUser).toHaveBeenCalledWith(
          requestFixture.headers,
          expectedBody,
        );
      });

      it('should return UserV1', () => {
        expect(result).toBe(userV1);
      });
    });

    describe('when called, and httpClient.createUser() returns an BAD_REQUEST response', () => {
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

        httpClientMock.createUser.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.BAD_REQUEST,
        });

        try {
          await createUserMutationResolver.createUser(
            undefined,
            {
              userCreateInput: {
                email: emailFixture,
                name: nameFixture,
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

      it('should call httpClient.createUser()', () => {
        const expectedBody: apiModels.UserCreateQueryV1 = {
          email: emailFixture,
          name: nameFixture,
          password: passwordFixture,
        };

        expect(httpClientMock.createUser).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createUser).toHaveBeenCalledWith(
          requestFixture.headers,
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.entityConflict,
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
