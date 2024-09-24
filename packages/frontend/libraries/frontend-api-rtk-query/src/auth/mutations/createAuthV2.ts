import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiParams } from '../../foundation/http/models/HttpApiParams';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  BAD_REQUEST,
  OK,
  UNAUTHORIZED,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import {
  CreateAuthV2Args,
  CreateAuthV2RefreshTokenArgs,
} from '../models/CreateAuthV2Args';

type PostAuthV2Params = HttpApiParams<'createAuthV2'>;
type PostAuthV2Response = HttpApiResult<'createAuthV2'>;

function buildPostAuthV2Params(args: CreateAuthV2Args): PostAuthV2Params {
  if (isRefreshTokenArgs(args)) {
    return [{ authorization: `Bearer ${args.refreshToken}` }, undefined];
  } else {
    return [{}, args.authCreateQuery];
  }
}

function isRefreshTokenArgs(
  args: CreateAuthV2Args,
): args is CreateAuthV2RefreshTokenArgs {
  return (
    (args as Partial<CreateAuthV2RefreshTokenArgs>).refreshToken !== undefined
  );
}

export function createAuthV2(
  httpClient: HttpClient,
): (
  args: CreateAuthV2Args,
) => Promise<QueryReturnValue<apiModels.AuthV2, SerializableAppError, never>> {
  return async (
    args: CreateAuthV2Args,
  ): Promise<
    QueryReturnValue<apiModels.AuthV2, SerializableAppError, never>
  > => {
    const postAuthV2Params: PostAuthV2Params = buildPostAuthV2Params(args);
    const httpResponse: PostAuthV2Response =
      await httpClient.endpoints.createAuthV2(...postAuthV2Params);

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
          error: {
            kind: AppErrorKind.unknown,
            message: '',
          },
        };
    }
  };
}
