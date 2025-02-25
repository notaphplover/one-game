import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { Either } from '../../common/models/Either';
import { getWinnerUserId } from '../helpers/getWinnerUserId';
import { useGetUsersV1 } from './useGetUsersV1';

export type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

export interface UseGetWinnerUserV1ForGamesResult {
  result: Either<
    SerializableAppError | SerializedError,
    apiModels.MaybeUserArrayV1
  > | null;
}

export const useGetWinnerUserV1ForGames = (
  gamesV1Result: Either<
    SerializableAppError | SerializedError,
    apiModels.GameArrayV1
  > | null,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetWinnerUserV1ForGamesResult => {
  const userIds: string[] =
    gamesV1Result?.isRight === true
      ? gamesV1Result.value.map(
          (gameV1: apiModels.GameV1): string => getWinnerUserId(gameV1) ?? '',
        )
      : [];

  const userSortOptionV1: apiModels.UserSortOptionV1 = 'ids';

  return useGetUsersV1(
    {
      params: [
        {
          id: userIds,
          sort: userSortOptionV1,
        },
      ],
    },
    {
      ...subscriptionOptions,
      skip: userIds.length === 0,
    },
  );
};
