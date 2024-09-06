import { models as apiModels } from '@cornie-js/api-models';
import { GetGamesSpecsV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

function useGetGamesSpecsV1(
  getGamesSpecsV1Args: GetGamesSpecsV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): {
  result: Either<string, apiModels.GameSpecArrayV1> | null;
} {
  const result = cornieApi.useGetGamesSpecsV1Query(
    getGamesSpecsV1Args,
    subscriptionOptions,
  );

  return { result: mapUseQueryHookResult(result) };
}

export interface UseGetGameSpecsV1ForGamesResult {
  result: Either<string, apiModels.GameSpecArrayV1> | null;
}

export const useGetGameSpecsV1ForGames = (
  gamesV1Result: Either<string, apiModels.GameArrayV1> | null,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetGameSpecsV1ForGamesResult => {
  const gameIds: string[] =
    gamesV1Result?.isRight === true
      ? gamesV1Result.value.map((gameV1: apiModels.GameV1): string => gameV1.id)
      : [];

  const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';

  return useGetGamesSpecsV1(
    {
      params: [
        {
          gameId: gameIds,
          sort: gameSpecSortOptionV1,
        },
      ],
    },
    {
      ...subscriptionOptions,
      skip: gameIds.length === 0,
    },
  );
};
