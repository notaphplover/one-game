import { buildSerializableResponse } from '../http/helpers/buildSerializableResponse';
import { UserMeResponse } from '../http/models/UserMeResponse';
import { UserMeSerializedResponse } from '../http/models/UserMeSerializedResponse';
import { httpClient } from '../http/services/HttpService';

export const getUserMeId = async (
  token: string,
): Promise<UserMeSerializedResponse> => {
  const response: UserMeResponse = await httpClient.endpoints.getUserMe({
    authorization: `Bearer ${token}`,
  });

  return buildSerializableResponse(response);
};
