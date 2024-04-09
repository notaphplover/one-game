import { describe, afterAll, beforeAll, expect, it, jest } from '@jest/globals';

jest.mock('../http/services/HttpService');
jest.mock('../http/helpers/buildSerializableResponse');

import { getUserMeId } from './getUserMeId';
import { httpClient } from '../http/services/HttpService';
import { buildSerializableResponse } from '../http/helpers/buildSerializableResponse';
import { UserMeResponse } from '../http/models/UserMeResponse';
import { UserMeSerializedResponse } from '../http/models/UserMeSerializedResponse';

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
        headers: {},
        body: {
          name: 'name-fixture',
          id: 'userId-fixture',
          active: true,
        },
        statusCode: 200,
      };

      userMeSerializedResponseFixture = {
        body: {
          name: 'name-fixture',
          id: 'userId-fixture',
          active: true,
        },
        statusCode: 200,
      };

      (
        httpClient.getUserMe as jest.Mock<typeof httpClient.getUserMe>
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
        headers: {},
        body: {
          description: 'error-fixture',
        },
        statusCode: 401,
      };

      userMeSerializedResponseFixture = {
        body: {
          description: 'error-fixture',
        },
        statusCode: 401,
      };

      (
        httpClient.getUserMe as jest.Mock<typeof httpClient.getUserMe>
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
