import { HttpClient } from '@cornie-js/api-http-client';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  CONFLICT,
  CREATED,
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { CreateUsersV1EmailCodeArgs } from '../models/CreateUsersV1EmailCodeArgs';

type CreateUsersV1EmailCodeResult = HttpApiResult<'createUserByEmailCode'>;

export function createUsersV1EmailCode(
  httpClient: HttpClient,
): (
  args: CreateUsersV1EmailCodeArgs,
  api: BaseQueryApi,
) => Promise<QueryReturnValue<undefined, SerializableAppError, never>> {
  return async (
    args: CreateUsersV1EmailCodeArgs,
  ): Promise<QueryReturnValue<undefined, SerializableAppError, never>> => {
    const httpResponse: CreateUsersV1EmailCodeResult =
      await httpClient.endpoints.createUserByEmailCode({}, ...args.params);

    switch (httpResponse.statusCode) {
      case CREATED:
        return {
          data: httpResponse.body,
        };
      case CONFLICT:
        return {
          error: {
            kind: AppErrorKind.entityConflict,
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
            message: 'Unexpected error',
          },
        };
    }
  };
}
