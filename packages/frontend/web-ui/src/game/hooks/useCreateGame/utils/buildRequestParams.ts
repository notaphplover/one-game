import { models as apiModels } from '@cornie-js/api-models';

import { HttpApiParams } from '../../../../common/http/models/HttpApiParams';
import { FormFieldsNewGame } from '../../../models/FormFieldsNewGame';
import { UseCreateGameContext } from '../models/UseCreateGameContext';

export function buildRequestParams(
  context: UseCreateGameContext,
  params: FormFieldsNewGame,
): HttpApiParams<'createGame'> {
  return [
    {
      authorization: `Bearer ${context.token}`,
    },
    buildBody(params),
  ];
}

function buildBody(params: FormFieldsNewGame): apiModels.GameCreateQueryV1 {
  let body: apiModels.GameCreateQueryV1;

  if (params.name === undefined) {
    body = {
      gameSlotsAmount: params.players,
      options: params.options,
    };
  } else {
    body = {
      gameSlotsAmount: params.players,
      name: params.name,
      options: params.options,
    };
  }
  return body;
}
