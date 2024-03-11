import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../common/http/services/HttpService');
jest.mock('../../../common/http/helpers/buildSerializableResponse');

import { createAuthByToken } from './createAuthByToken';
import { httpClient } from '../../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { AuthResponse } from '../../../common/http/models/AuthResponse';

describe(createAuthByToken.name, () => {
  describe('when called', () => {
    let codeFixture: string;
    let dispatchMock: jest.Mock;
    let getStateMock: jest.Mock;
    let extraMock: unknown;
    let authResponseFixture: AuthResponse;
    let serializableResponseFixture: AuthSerializedResponse;
    let result: unknown;

    beforeAll(async () => {
      codeFixture = 'code-fixture';
      dispatchMock = jest.fn();
      getStateMock = jest.fn();
      extraMock = {
        extra: 'fixture',
      };

      authResponseFixture = {
        headers: {},
        body: {
          jwt: 'jwt-fixture',
        },
        statusCode: 200,
      };

      serializableResponseFixture = {
        body: {
          jwt: 'jwt-fixture',
        },
        statusCode: 200,
      };

      (
        httpClient.createAuth as jest.Mock<typeof httpClient.createAuth>
      ).mockResolvedValueOnce(authResponseFixture);
      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(serializableResponseFixture);

      result = await createAuthByToken(codeFixture)(
        dispatchMock,
        getStateMock,
        extraMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call dispatch()', () => {
      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          meta: expect.objectContaining({
            requestStatus: 'pending',
          }),
        }),
      );
      expect(dispatchMock).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          meta: expect.objectContaining({
            requestStatus: 'fulfilled',
          }),
        }),
      );
    });

    it('should call httpClient.createAuth()', () => {
      expect(httpClient.createAuth).toHaveBeenCalledTimes(1);
      expect(httpClient.createAuth).toHaveBeenCalledWith(
        {},
        {
          code: codeFixture,
        },
      );
    });

    it('should call buildSerializableResponse()', () => {
      expect(buildSerializableResponse).toHaveBeenCalledTimes(1);
      expect(buildSerializableResponse).toHaveBeenCalledWith(
        authResponseFixture,
      );
    });

    it('should return serializable response', () => {
      expect(result).toStrictEqual({
        meta: expect.any(Object),
        payload: serializableResponseFixture,
        type: expect.stringContaining('fulfilled'),
      });
    });
  });
});
