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
import { GetUsersV1Args } from '../models/GetUsersV1Args';

type GetUsersResult = HttpApiResult<'getUsers'>;

export function getUsersV1(
  httpClient: HttpClient,
): (
  args: GetUsersV1Args,
  api: BaseQueryApi,
  accessToken: string | null,
) => Promise<
  QueryReturnValue<apiModels.UserArrayV1, SerializableAppError, never>
> {
  return async (
    args: GetUsersV1Args,
    _api: BaseQueryApi,
    accessToken: string | null,
  ): Promise<
    QueryReturnValue<apiModels.UserArrayV1, SerializableAppError, never>
  > => {
    const httpResponse: GetUsersResult = await httpClient.endpoints.getUsers(
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
