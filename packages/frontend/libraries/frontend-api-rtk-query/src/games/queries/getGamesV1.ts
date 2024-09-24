import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  BAD_REQUEST,
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetGamesV1Args } from '../models/GetGamesV1Args';

type GetGamesResult = HttpApiResult<'getGames'>;

export function getGamesV1(
  httpClient: HttpClient,
): (
  args: GetGamesV1Args,
  api: BaseQueryApi,
  accessToken: string | null,
) => Promise<
  QueryReturnValue<apiModels.GameArrayV1, SerializableAppError, never>
> {
  return async (
    args: GetGamesV1Args,
    _api: BaseQueryApi,
    accessToken: string | null,
  ): Promise<
    QueryReturnValue<apiModels.GameArrayV1, SerializableAppError, never>
  > => {
    const httpResponse: GetGamesResult = await httpClient.endpoints.getGames(
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
