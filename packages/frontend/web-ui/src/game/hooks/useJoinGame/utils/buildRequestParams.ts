import { HttpApiParams } from '../../../../common/http/models/HttpApiParams';
import { UseJoinGameContext } from '../models/UseJoinGameContext';
import { UseJoinGameParams } from '../models/UseJoinGameParams';
import { UNEXPECTED_ERROR_MESSAGE } from './unexpectedErrorMessage';

export function buildRequestParams(
  context: UseJoinGameContext,
  params: UseJoinGameParams,
): HttpApiParams<'createGameSlot'> {
  if (context.token === null || context.userId === null) {
    throw new Error(UNEXPECTED_ERROR_MESSAGE);
  }

  return [
    {
      authorization: `Bearer ${context.token}`,
    },
    {
      gameId: params.gameId,
    },
    {
      userId: context.userId,
    },
  ];
}
