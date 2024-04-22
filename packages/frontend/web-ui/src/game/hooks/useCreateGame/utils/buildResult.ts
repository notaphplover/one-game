import { models as apiModels } from '@cornie-js/api-models';
import { HttpApiResult } from '../../../../common/http/models/HttpApiResult';
import { Either } from '../../../../common/models/Either';
import {
  FORBIDDEN_ERROR_MESSAGE,
  HTTP_BAD_REQUEST_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
} from './unexpectedErrorMessage';

export function buildResult(
  response: HttpApiResult<'createGame'>,
): Either<string, apiModels.NonStartedGameV1> {
  switch (response.statusCode) {
    case 200:
      return {
        isRight: true,
        value: response.body,
      };
    case 400:
      return {
        isRight: false,
        value: HTTP_BAD_REQUEST_ERROR_MESSAGE,
      };
    case 401:
      return {
        isRight: false,
        value: UNAUTHORIZED_ERROR_MESSAGE,
      };
    case 403:
      return {
        isRight: false,
        value: FORBIDDEN_ERROR_MESSAGE,
      };
    default:
      return {
        isRight: false,
        value: UNEXPECTED_ERROR_MESSAGE,
      };
  }
}
