import { models as apiModels } from '@cornie-js/api-models';
import {
  ApiTag,
  GetGamesV1GameIdSlotsSlotIdCardsArgs,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import {
  BaseQueryFn,
  QueryActionCreatorResult,
  QueryDefinition,
} from '@reduxjs/toolkit/query';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

export interface UseGetGamesV1GameIdSlotsSlotIdCardsResult {
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      GetGamesV1GameIdSlotsSlotIdCardsArgs,
      BaseQueryFn<void, symbol, SerializableAppError>,
      ApiTag,
      apiModels.CardArrayV1
    >
  >;
  result: Either<string, apiModels.CardArrayV1> | null;
}

export const useGetGamesV1GameIdSlotsSlotIdCards = (
  gameId: string | undefined,
  gameSlotIndex: string | undefined,
): UseGetGamesV1GameIdSlotsSlotIdCardsResult => {
  const useGetUsersV1MeQueryResult =
    cornieApi.useGetGamesV1GameIdSlotsSlotIdCardsQuery(
      {
        params: [
          {
            gameId: gameId ?? '',
            gameSlotIndex: gameSlotIndex ?? '0',
          },
        ],
      },
      {
        skip: gameId === undefined || gameSlotIndex === undefined,
      },
    );

  const result: Either<string, apiModels.CardArrayV1> | null =
    mapUseQueryHookResult(useGetUsersV1MeQueryResult);

  return {
    refetch: useGetUsersV1MeQueryResult.refetch,
    result,
  };
};
