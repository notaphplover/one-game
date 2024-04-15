import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  HttpClient,
  HttpClientEndpoints,
  Response,
} from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import {
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-game-env';
import { HttpStatus } from '@nestjs/common';

import { UserV1Fixtures } from '../../fixtures/models/UserV1Fixtures';
import { UserManagementInputPort } from './UserManagementInputPort';

describe(UserManagementInputPort.name, () => {
  let backendSecretFixture: string;

  let environmentServiceMock: jest.Mocked<EnvironmentService>;
  let httpClientMock: jest.Mocked<HttpClient>;

  let userManagementInputPort: UserManagementInputPort;

  beforeAll(() => {
    const environmentFixture: Environment = {
      apiBackendServiceSecret: backendSecretFixture,
    } as Partial<Environment> as Environment;

    backendSecretFixture = 'backend-secret-fixture';
    environmentServiceMock = {
      getEnvironment: jest.fn(),
    } as Partial<
      jest.Mocked<EnvironmentService>
    > as jest.Mocked<EnvironmentService>;

    environmentServiceMock.getEnvironment.mockReturnValue(environmentFixture);

    httpClientMock = {
      endpoints: {
        getUser: jest.fn(),
      } as Partial<jest.Mocked<HttpClientEndpoints>>,
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    userManagementInputPort = new UserManagementInputPort(
      environmentServiceMock,
      httpClientMock,
    );
  });

  describe('.findOne', () => {
    let userIdFixture: string;

    beforeAll(() => {
      userIdFixture = 'user-id';
    });

    describe('when called, and httpClient.endpoints.getUser() returns an ok response with a user', () => {
      let responseFixture: Response<
        Record<string, string>,
        apiModels.UserV1,
        HttpStatus.OK
      >;

      let result: unknown;

      beforeAll(async () => {
        responseFixture = {
          body: UserV1Fixtures.any,
          headers: {},
          statusCode: HttpStatus.OK,
        };

        httpClientMock.endpoints.getUser.mockResolvedValueOnce(responseFixture);

        result = await userManagementInputPort.findOne(userIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.endpoints.getUser()', () => {
        expect(httpClientMock.endpoints.getUser).toHaveBeenCalledTimes(1);
        expect(httpClientMock.endpoints.getUser).toHaveBeenCalledWith(
          {
            Authorization: expect.any(String),
          },
          {
            userId: userIdFixture,
          },
        );
      });

      it('should return a user v1', () => {
        expect(result).toStrictEqual(responseFixture.body);
      });
    });
  });
});
