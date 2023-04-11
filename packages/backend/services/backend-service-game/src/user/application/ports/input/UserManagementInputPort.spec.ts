import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { HttpStatus } from '@nestjs/common';
import { HttpClient, Response } from '@one-game-js/api-http-client';
import { models as apiModels } from '@one-game-js/api-models';

import { Environment } from '../../../../foundation/env/application/models/Environment';
import { EnvironmentService } from '../../../../foundation/env/application/services/EnvironmentService';
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
      getUser: jest.fn(),
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

    describe('when called, and httpClient.getUser() returns an ok response with a user', () => {
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

        httpClientMock.getUser.mockResolvedValueOnce(responseFixture);

        result = await userManagementInputPort.findOne(userIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.getUser()', () => {
        expect(httpClientMock.getUser).toHaveBeenCalledTimes(1);
        expect(httpClientMock.getUser).toHaveBeenCalledWith(
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
