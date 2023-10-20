import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { createAuthByCredentials } from './createAuthByCredentials';
import { httpClient } from '../../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';

jest.mock('../../../common/http/services/HttpService');
jest.mock('../../../common/http/helpers/buildSerializableResponse');

describe('thunk createAuthByCredentials', () => {
  describe('when called', () => {
    let emailPasswordFixture;
    let dispatchMock;
    let authResponseFixture;
    let serializableResponseFixture;
    let result;

    beforeAll(async () => {
      emailPasswordFixture = {
        email: 'email-fixture',
        password: 'password-fixture',
      };

      dispatchMock = jest.fn();

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

      httpClient.createAuth.mockResolvedValueOnce(authResponseFixture);
      buildSerializableResponse.mockReturnValueOnce(
        serializableResponseFixture,
      );

      result =
        await createAuthByCredentials(emailPasswordFixture)(dispatchMock);
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
        emailPasswordFixture,
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
