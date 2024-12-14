import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetUserV1Args } from '../models/GetUserV1Args';

type GetUserV1Result = HttpApiResult<'getUser'>;

export function getUserV1(
  httpClient: HttpClient,
): (
  args: GetUserV1Args,
  api: BaseQueryApi,
  accessToken: string | null,
) => Promise<
  QueryReturnValue<apiModels.UserV1 | undefined, SerializableAppError, never>
> {
  return async (
    args: GetUserV1Args,
    _api: BaseQueryApi,
    accessToken: string | null,
  ): Promise<
    QueryReturnValue<apiModels.UserV1 | undefined, SerializableAppError, never>
  > => {
    const httpResponse: GetUserV1Result = await httpClient.endpoints.getUser(
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
      case NOT_FOUND:
        return {
          data: undefined,
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
