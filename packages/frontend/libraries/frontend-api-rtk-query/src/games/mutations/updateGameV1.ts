import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { UpdateGameV1Args } from '../models/UpdateGameV1Args';

type UpdateGamesV1Result = HttpApiResult<'updateGame'>;

export function updateGameV1(
  httpClient: HttpClient,
): (
  args: UpdateGameV1Args,
  api: BaseQueryApi,
  accessToken: string | null,
) => Promise<QueryReturnValue<apiModels.GameV1, SerializableAppError, never>> {
  return async (
    args: UpdateGameV1Args,
    _api: BaseQueryApi,
    accessToken: string | null,
  ): Promise<
    QueryReturnValue<apiModels.GameV1, SerializableAppError, never>
  > => {
    const httpResponse: UpdateGamesV1Result =
      await httpClient.endpoints.updateGame(
        {
          authorization: `Bearer ${accessToken ?? ''}`,
        },
        ...args.params,
      );

    switch (httpResponse.statusCode) {
      case OK:
        return {
          data: httpResponse.body,
        };
      case BAD_REQUEST:
        return {
          error: {
            kind: AppErrorKind.contractViolation,
            message: httpResponse.body.description,
          },
        };
      case UNAUTHORIZED:
        return {
          error: {
            kind: AppErrorKind.missingCredentials,
            message: httpResponse.body.description,
          },
        };
      case FORBIDDEN:
        return {
          error: {
            kind: AppErrorKind.invalidCredentials,
            message: httpResponse.body.description,
          },
        };
      case NOT_FOUND:
        return {
          error: {
            kind: AppErrorKind.entityNotFound,
            message: httpResponse.body.description,
          },
        };
      case UNPROCESSABLE_CONTENT:
        return {
          error: {
            kind: AppErrorKind.unprocessableOperation,
            message: httpResponse.body.description,
          },
        };
      default:
        return {
          error: {
            kind: AppErrorKind.unknown,
            message: '',
          },
        };
    }
  };
}
