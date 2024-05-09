import { describe, afterAll, beforeAll, expect, it, jest } from '@jest/globals';

jest.mock('../http/services/HttpService');
jest.mock('../http/helpers/buildSerializableResponse');

import { buildSerializableResponse } from '../http/helpers/buildSerializableResponse';
import { UserMeResponse } from '../http/models/UserMeResponse';
import { UserMeSerializedResponse } from '../http/models/UserMeSerializedResponse';
import { httpClient } from '../http/services/HttpService';
import { getUserMeId } from './getUserMeId';

describe(getUserMeId.name, () => {
  let tokenFixture: string;

  beforeAll(() => {
    tokenFixture = 'token-fixture';
  });

  describe('having a valid token', () => {
    let userMeResponseFixture: UserMeResponse;
    let userMeSerializedResponseFixture: UserMeSerializedResponse;
    let result: unknown;

    beforeAll(async () => {
      userMeResponseFixture = {
        body: {
          active: true,
          id: 'userId-fixture',
          name: 'name-fixture',
        },
        headers: {},
        statusCode: 200,
      };

      userMeSerializedResponseFixture = {
        body: {
          active: true,
          id: 'userId-fixture',
          name: 'name-fixture',
        },
        statusCode: 200,
      };

      (
        httpClient.endpoints.getUserMe as jest.Mock<
          typeof httpClient.endpoints.getUserMe
        >
      ).mockResolvedValueOnce(userMeResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(userMeSerializedResponseFixture);

      result = await getUserMeId(tokenFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an OK response', () => {
      expect(result).toStrictEqual(userMeSerializedResponseFixture);
    });
  });

  describe('having a null token', () => {
    let userMeResponseFixture: UserMeResponse;
    let userMeSerializedResponseFixture: UserMeSerializedResponse;
    let result: unknown;

    beforeAll(async () => {
      tokenFixture = '';

      userMeResponseFixture = {
        body: {
          description: 'error-fixture',
        },
        headers: {},
        statusCode: 401,
      };

      userMeSerializedResponseFixture = {
        body: {
          description: 'error-fixture',
        },
        statusCode: 401,
      };

      (
        httpClient.endpoints.getUserMe as jest.Mock<
          typeof httpClient.endpoints.getUserMe
        >
      ).mockResolvedValueOnce(userMeResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(userMeSerializedResponseFixture);

      result = await getUserMeId(tokenFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a non OK response', () => {
      expect(result).toStrictEqual(userMeSerializedResponseFixture);
    });
  });
});
