import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/frontend-common';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  BAD_REQUEST,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetGamesV1MineArgs } from '../models/GetGamesV1MineArgs';

type GetGamesMineResult = HttpApiResult<'getGamesMine'>;

export function getGamesV1Mine(
  httpClient: HttpClient,
): (
  args: GetGamesV1MineArgs,
) => Promise<
  QueryReturnValue<apiModels.GameArrayV1, SerializableAppError, never>
> {
  return async (
    args: GetGamesV1MineArgs,
  ): Promise<
    QueryReturnValue<apiModels.GameArrayV1, SerializableAppError, never>
  > => {
    const httpResponse: GetGamesMineResult =
      await httpClient.endpoints.getGamesMine(...args.params);

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
      default:
        return {
          error: new AppError(AppErrorKind.unknown),
        };
    }
  };
}
