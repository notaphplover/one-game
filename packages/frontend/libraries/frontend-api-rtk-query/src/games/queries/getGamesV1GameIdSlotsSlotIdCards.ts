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
  UNPROCESSABLE_CONTENT,
} from '../../foundation/http/models/httpCodes';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { GetGamesV1GameIdSlotsSlotIdCardsArgs } from '../models/GetGamesV1GameIdSlotsSlotIdCardsArgs';

type GetGamesV1GameIdSlotsSlotIdCardsResult = HttpApiResult<'getGameSlotCards'>;

export function getGamesV1GameIdSlotsSlotIdCards(
  httpClient: HttpClient,
): (
  args: GetGamesV1GameIdSlotsSlotIdCardsArgs,
  api: BaseQueryApi,
  accessToken: string | null,
) => Promise<
  QueryReturnValue<apiModels.CardArrayV1, SerializableAppError, never>
> {
  return async (
    args: GetGamesV1GameIdSlotsSlotIdCardsArgs,
    _api: BaseQueryApi,
    accessToken: string | null,
  ): Promise<
    QueryReturnValue<apiModels.CardArrayV1, SerializableAppError, never>
  > => {
    const httpResponse: GetGamesV1GameIdSlotsSlotIdCardsResult =
      await httpClient.endpoints.getGameSlotCards(
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
