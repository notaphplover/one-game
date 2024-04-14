import { describe, afterAll, beforeAll, expect, it, jest } from '@jest/globals';

jest.mock('../http/services/HttpService');
jest.mock('../http/helpers/buildSerializableResponse');

import { joinGame } from './joinGame';
import { httpClient } from '../http/services/HttpService';
import { buildSerializableResponse } from '../http/helpers/buildSerializableResponse';
import { JoinGameResponse } from '../http/models/JoinGameResponse';
import { JoinGameSerializedResponse } from '../http/models/JoinGameSerializedResponse';

describe(joinGame.name, () => {
  let tokenFixture: string;
  let gameIdFixture: string;
  let userIdFixture: string;

  beforeAll(() => {
    tokenFixture = 'token-fixture';
    gameIdFixture = 'game-id-fixture';
    userIdFixture = 'user-id-fixture';
  });

  describe('having a valid token, valid gameId and valid userId', () => {
    let joinGameResponseFixture: JoinGameResponse;
    let joinGameSerializedResponseFixture: JoinGameSerializedResponse;
    let result: unknown;

    beforeAll(async () => {
      joinGameResponseFixture = {
        headers: {},
        body: {
          userId: 'userId-fixture',
        },
        statusCode: 200,
      };

      joinGameSerializedResponseFixture = {
        body: {
          userId: 'userId-fixture',
        },
        statusCode: 200,
      };

      (
        httpClient.endpoints.createGameSlot as jest.Mock<
          typeof httpClient.endpoints.createGameSlot
        >
      ).mockResolvedValueOnce(joinGameResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(joinGameSerializedResponseFixture);

      result = await joinGame(tokenFixture, gameIdFixture, userIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an OK response', () => {
      expect(result).toStrictEqual(joinGameSerializedResponseFixture);
    });
  });

  describe('having a null token or null gameId or null userId', () => {
    let joinGameResponseFixture: JoinGameResponse;
    let joinGameSerializedResponseFixture: JoinGameSerializedResponse;
    let result: unknown;

    beforeAll(async () => {
      tokenFixture = '';
      joinGameResponseFixture = {
        headers: {},
        body: {
          description: 'error-fixture',
        },
        statusCode: 400,
      };

      joinGameSerializedResponseFixture = {
        body: {
          description: 'error-fixture',
        },
        statusCode: 400,
      };

      (
        httpClient.endpoints.createGameSlot as jest.Mock<
          typeof httpClient.endpoints.createGameSlot
        >
      ).mockResolvedValueOnce(joinGameResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(joinGameSerializedResponseFixture);

      result = await joinGame(tokenFixture, gameIdFixture, userIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an OK response', () => {
      expect(result).toStrictEqual(joinGameSerializedResponseFixture);
    });
  });
});
