import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesV1MineArgs,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

export interface UseGetGamesV1MineResult {
  result: Either<
    SerializableAppError | SerializedError,
    apiModels.GameArrayV1
  > | null;
}

export function useGetGamesV1Mine(
  getGamesV1Args: GetGamesV1MineArgs,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetGamesV1MineResult {
  const result = cornieApi.useGetGamesV1MineQuery(
    getGamesV1Args,
    subscriptionOptions,
  );

  return { result: mapUseQueryHookResultV2(result) };
}
