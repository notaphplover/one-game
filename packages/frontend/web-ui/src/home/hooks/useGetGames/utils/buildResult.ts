import { models as apiModels } from '@cornie-js/api-models';
import { HttpApiResult } from '../../../../common/http/models/HttpApiResult';
import { Either } from '../../../../common/models/Either';
import { UNEXPECTED_ERROR_MESSAGE } from './unexpectedErrorMesssage';

export function buildResult(
  response: HttpApiResult<'getGamesMine'>,
): Either<string, apiModels.GameArrayV1> {
  switch (response.statusCode) {
    case 200:
      return {
        isRight: true,
        value: response.body,
      };
    default:
      return {
        isRight: false,
        value: UNEXPECTED_ERROR_MESSAGE,
      };
  }
}
