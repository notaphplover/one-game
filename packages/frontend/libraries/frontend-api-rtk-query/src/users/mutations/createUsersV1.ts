import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  BAD_REQUEST,
  CONFLICT,
  OK,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { CreateUsersV1Args } from '../models/CreateUsersV1Args';

type CreateUsersV1Result = HttpApiResult<'createUser'>;

export function createUsersV1(
  httpClient: HttpClient,
): (
  args: CreateUsersV1Args,
  api: BaseQueryApi,
) => Promise<QueryReturnValue<apiModels.UserV1, SerializableAppError, never>> {
  return async (
    args: CreateUsersV1Args,
  ): Promise<
    QueryReturnValue<apiModels.UserV1, SerializableAppError, never>
  > => {
    const httpResponse: CreateUsersV1Result =
      await httpClient.endpoints.createUser({}, ...args.params);

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
      case CONFLICT:
        return {
          error: {
            kind: AppErrorKind.entityConflict,
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
