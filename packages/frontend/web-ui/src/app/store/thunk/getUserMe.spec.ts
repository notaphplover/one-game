import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../common/http/services/httpClient');
jest.mock('../../../common/http/helpers/buildSerializableResponse');

import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { UserMeResponse } from '../../../common/http/models/UserMeResponse';
import { UserMeSerializedResponse } from '../../../common/http/models/UserMeSerializedResponse';
import { httpClient } from '../../../common/http/services/httpClient';
import { getUserMe } from './getUserMe';

describe(getUserMe.name, () => {
  describe('when called', () => {
    let tokenFixture: string;
    let dispatchMock: jest.Mock;
    let getStateMock: jest.Mock;
    let extraMock: unknown;
    let userMeResponseFixture: UserMeResponse;
    let userMeSerializedResponseFixture: UserMeSerializedResponse;
    let result: unknown;

    beforeAll(async () => {
      tokenFixture = 'token-fixture';
      dispatchMock = jest.fn();
      getStateMock = jest.fn();
      extraMock = {
        extra: 'fixture',
      };

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

      result = await getUserMe(tokenFixture)(
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

    it('should call httpClient.endpoints.getUserMe()', () => {
      expect(httpClient.endpoints.getUserMe).toHaveBeenCalledTimes(1);
      expect(httpClient.endpoints.getUserMe).toHaveBeenCalledWith({
        authorization: `Bearer ${tokenFixture}`,
      });
    });

    it('should call buildSerializableResponse()', () => {
      expect(buildSerializableResponse).toHaveBeenCalledTimes(1);
      expect(buildSerializableResponse).toHaveBeenCalledWith(
        userMeResponseFixture,
      );
    });

    it('should return serializable response', () => {
      expect(result).toStrictEqual({
        meta: expect.any(Object),
        payload: userMeSerializedResponseFixture,
        type: expect.stringContaining('fulfilled'),
      });
    });
  });
});
