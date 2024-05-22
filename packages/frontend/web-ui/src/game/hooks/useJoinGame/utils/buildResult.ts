import { models as apiModels } from '@cornie-js/api-models';

import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_REQUEST,
} from '../../../../common/http/helpers/httpCodes';
import { HttpApiResult } from '../../../../common/http/models/HttpApiResult';
import { Either } from '../../../../common/models/Either';
import {
  CONFLICT_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  HTTP_BAD_REQUEST_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
  UNPROCESSABLE_REQUEST_ERROR_MESSAGE,
} from './unexpectedErrorMessage';

export function buildResult(
  response: HttpApiResult<'createGameSlot'>,
): Either<string, apiModels.GameSlotV1> {
  switch (response.statusCode) {
    case OK:
      return {
        isRight: true,
        value: response.body,
      };
    case BAD_REQUEST:
      return {
        isRight: false,
        value: HTTP_BAD_REQUEST_ERROR_MESSAGE,
      };
    case UNAUTHORIZED:
      return {
        isRight: false,
        value: UNAUTHORIZED_ERROR_MESSAGE,
      };
    case FORBIDDEN:
      return {
        isRight: false,
        value: FORBIDDEN_ERROR_MESSAGE,
      };
    case CONFLICT:
      return {
        isRight: false,
        value: CONFLICT_ERROR_MESSAGE,
      };
    case UNPROCESSABLE_REQUEST:
      return {
        isRight: false,
        value: UNPROCESSABLE_REQUEST_ERROR_MESSAGE,
      };
    default:
      return {
        isRight: false,
        value: UNEXPECTED_ERROR_MESSAGE,
      };
  }
}
