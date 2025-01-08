import { models as apiModels } from '@cornie-js/api-models';
import { GetUsersV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

function useGetUsersV1(
  getUsersV1Args: GetUsersV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): {
  result: Either<string, apiModels.MaybeUserArrayV1> | null;
} {
  const result = cornieApi.useGetUsersV1Query(
    getUsersV1Args,
    subscriptionOptions,
  );

  return { result: mapUseQueryHookResult(result) };
}

export interface UseGetWinnerUserV1ForGamesResult {
  result: Either<string, apiModels.MaybeUserArrayV1> | null;
}

export const useGetWinnerUserV1ForGames = (
  gamesV1Result: Either<string, apiModels.GameArrayV1> | null,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetWinnerUserV1ForGamesResult => {
  const gameIds: string[] =
    gamesV1Result?.isRight === true
      ? gamesV1Result.value.map((gameV1: apiModels.GameV1): string => gameV1.id)
      : [];

  const userSortOptionV1: apiModels.UserSortOptionV1 = 'ids';

  return useGetUsersV1(
    {
      params: [
        {
          gameId: gameIds,
          sort: userSortOptionV1,
        },
      ],
    },
    {
      ...subscriptionOptions,
      skip: gameIds.length === 0,
    },
  );
};
