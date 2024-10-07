import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  FORBIDDEN,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetGamesGameIdSpecsV1Args } from '../models/GetGamesGameIdSpecsV1Args';

type GetGamesGameIdSpecsResult = HttpApiResult<'getGameGameIdSpec'>;

export function getGamesGameIdSpecsV1(
  httpClient: HttpClient,
): (
  args: GetGamesGameIdSpecsV1Args,
  api: BaseQueryApi,
  accessToken: string | null,
) => Promise<
  QueryReturnValue<apiModels.GameSpecV1, SerializableAppError, never>
> {
  return async (
    args: GetGamesGameIdSpecsV1Args,
    _api: BaseQueryApi,
    accessToken: string | null,
  ): Promise<
    QueryReturnValue<apiModels.GameSpecV1, SerializableAppError, never>
  > => {
    const httpResponse: GetGamesGameIdSpecsResult =
      await httpClient.endpoints.getGameGameIdSpec(
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
