import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { HttpApiResult } from '../../foundation/http/models/HttpApiResult';
import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { CreateGamesV1SlotsArgs } from '../models/CreateGamesV1SlotsArgs';

type CreateGamesV1SlotsResult = HttpApiResult<'createGameSlot'>;

export function createGamesV1Slots(
  httpClient: HttpClient,
): (
  args: CreateGamesV1SlotsArgs,
  api: BaseQueryApi,
  accessToken: string | null,
) => Promise<
  QueryReturnValue<apiModels.NonStartedGameSlotV1, SerializableAppError, never>
> {
  return async (
    args: CreateGamesV1SlotsArgs,
    _api: BaseQueryApi,
    accessToken: string | null,
  ): Promise<
    QueryReturnValue<
      apiModels.NonStartedGameSlotV1,
      SerializableAppError,
      never
    >
  > => {
    const httpResponse: CreateGamesV1SlotsResult =
      await httpClient.endpoints.createGameSlot(
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
            message: '',
          },
        };
    }
  };
}
