import { HttpApiParams } from '../../../../common/http/models/HttpApiParams';
import { UseCreateGameContext } from '../models/UseCreateGameContext';
import { UseCreateGameParams } from '../models/UseCreateGameParams';
import { FormFieldsNewGame } from '../../../models/FormFieldsNewGame';

export function buildRequestParams(
  context: UseCreateGameContext,
  params: FormFieldsNewGame,
): HttpApiParams<'createGame'> {
  return [
    {
      authorization: `Bearer ${context.token}`,
    },
    buildQuery(params).body,
  ];
}

function buildQuery(params: FormFieldsNewGame): UseCreateGameParams {
  let bodyQuery: UseCreateGameParams;

  if (params.name !== undefined) {
    bodyQuery = {
      body: {
        gameSlotsAmount: params.players,
        options: params.options,
        name: params.name,
      },
    };
  } else {
    bodyQuery = {
      body: {
        gameSlotsAmount: params.players,
        options: params.options,
      },
    };
  }
  return bodyQuery;
}
