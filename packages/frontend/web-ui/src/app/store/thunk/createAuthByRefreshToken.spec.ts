import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../common/http/services/HttpService');
jest.mock('../../../common/http/helpers/buildSerializableResponse');
jest.mock('../hooks');

import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { AuthResponse } from '../../../common/http/models/AuthResponse';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { httpClient } from '../../../common/http/services/HttpService';
import { AuthenticatedAuthState } from '../helpers/models/AuthState';
import { AuthStateStatus } from '../helpers/models/AuthStateStatus';
import { useAppSelector } from '../hooks';
import { createAuthByRefreshToken } from './createAuthByRefreshToken';

describe('createAuthByRefreshToken', () => {
  describe('when called', () => {
    let authenticatedAuthStateFixture: AuthenticatedAuthState;
    let dispatchMock: jest.Mock;
    let getStateMock: jest.Mock;
    let extraMock: unknown;
    let authResponseFixture: AuthResponse;
    let serializableResponseFixture: AuthSerializedResponse;
    let result: unknown;

    beforeAll(async () => {
      authenticatedAuthStateFixture = {
        accessToken: 'accessToken-fixture',
        refreshToken: 'refreshToken-fixture',
        status: AuthStateStatus.authenticated,
      };

      dispatchMock = jest.fn();
      getStateMock = jest.fn();
      extraMock = {
        extra: 'fixture',
      };

      authResponseFixture = {
        body: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
        headers: {},
        statusCode: 200,
      };

      serializableResponseFixture = {
        body: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
        statusCode: 200,
      };

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(authenticatedAuthStateFixture);

      (
        httpClient.endpoints.createAuthV2 as jest.Mock<
          typeof httpClient.endpoints.createAuthV2
        >
      ).mockResolvedValueOnce(authResponseFixture);
      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(serializableResponseFixture);

      result = await createAuthByRefreshToken()(
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

    it('should call httpClient.endpoints.createAuthV2() with refreshToken value', () => {
      expect(httpClient.endpoints.createAuthV2).toHaveBeenCalledTimes(1);
      expect(httpClient.endpoints.createAuthV2).toHaveBeenCalledWith(
        {
          authorization: `Bearer ${authenticatedAuthStateFixture.refreshToken}`,
        },
        undefined,
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
