import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { UpdateUsersV1MeArgs } from '../models/UpdateUsersV1MeArgs';

type UpdateUsersV1MeResult = HttpApiResult<'updateUserMe'>;

export function updateUsersV1Me(
  httpClient: HttpClient,
): (
  args: UpdateUsersV1MeArgs,
  api: BaseQueryApi,
  accessToken: string | null,
) => Promise<QueryReturnValue<apiModels.UserV1, SerializableAppError, never>> {
  return async (
    args: UpdateUsersV1MeArgs,
    _api: BaseQueryApi,
    accessToken: string | null,
  ): Promise<
    QueryReturnValue<apiModels.UserV1, SerializableAppError, never>
  > => {
    const httpResponse: UpdateUsersV1MeResult =
      await httpClient.endpoints.updateUserMe(
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
