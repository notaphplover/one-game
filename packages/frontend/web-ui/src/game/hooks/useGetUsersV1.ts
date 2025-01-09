import { models as apiModels } from '@cornie-js/api-models';
import { GetUsersV1Args } from '@cornie-js/frontend-api-rtk-query';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { UseQuerySubscriptionOptions } from './useGetWinnerUserV1ForGames';

export interface UseGetUsersV1Result {
  result: Either<string, apiModels.MaybeUserArrayV1> | null;
}

export const useGetUsersV1 = (
  getUsersV1Args: GetUsersV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetUsersV1Result => {
  const result = cornieApi.useGetUsersV1Query(
    getUsersV1Args,
    subscriptionOptions,
  );

  return { result: mapUseQueryHookResult(result) };
};
