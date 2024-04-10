import { buildSerializableResponse } from '../http/helpers/buildSerializableResponse';
import { JoinGameResponse } from '../http/models/JoinGameResponse';
import { JoinGameSerializedResponse } from '../http/models/JoinGameSerializedResponse';
import { httpClient } from '../http/services/HttpService';

export const joinGame = async (
  token: string,
  gameId: string,
  userId: string,
): Promise<JoinGameSerializedResponse> => {
  const response: JoinGameResponse = await httpClient.createGameSlot(
    {
      authorization: `Bearer ${token}`,
    },
    {
      gameId: gameId,
    },
    {
      userId: userId,
    },
  );

  return buildSerializableResponse(response);
};
