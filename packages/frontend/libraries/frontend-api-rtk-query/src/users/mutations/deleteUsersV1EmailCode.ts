import { HttpClient } from '@cornie-js/api-http-client';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  OK,
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { DeleteUsersV1EmailCodeArgs } from '../models/DeleteUsersV1EmailCodeArgs';

type DeleteUsersV1EmailCodeResult = HttpApiResult<'deleteUserByEmailCode'>;

export function deleteUsersV1EmailCode(
  httpClient: HttpClient,
): (
  args: DeleteUsersV1EmailCodeArgs,
  api: BaseQueryApi,
) => Promise<QueryReturnValue<undefined, SerializableAppError, never>> {
  return async (
    args: DeleteUsersV1EmailCodeArgs,
  ): Promise<QueryReturnValue<undefined, SerializableAppError, never>> => {
    const httpResponse: DeleteUsersV1EmailCodeResult =
      await httpClient.endpoints.deleteUserByEmailCode({}, ...args.params);

    switch (httpResponse.statusCode) {
      case OK:
        return {
          data: httpResponse.body,
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
