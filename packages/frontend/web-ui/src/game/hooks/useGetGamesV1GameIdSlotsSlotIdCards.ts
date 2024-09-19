import { models as apiModels } from '@cornie-js/api-models';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

export interface UseGetGamesV1GameIdSlotsSlotIdCardsResult {
  result: Either<string, apiModels.CardArrayV1> | null;
}

export const useGetGamesV1GameIdSlotsSlotIdCards = (
  gameId: string | null,
  gameSlotIndex: string | null,
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
        skip: gameId === null || gameSlotIndex === null,
      },
    );

  const result: Either<string, apiModels.CardArrayV1> | null =
    mapUseQueryHookResult(useGetUsersV1MeQueryResult);

  return { result };
};
