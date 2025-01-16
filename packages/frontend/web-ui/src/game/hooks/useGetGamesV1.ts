import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesV1Args,
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

export interface UseGetGamesV1Result {
  result: Either<
    SerializableAppError | SerializedError,
    apiModels.GameArrayV1
  > | null;
}

export function useGetGamesV1(
  getGamesV1Args: GetGamesV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetGamesV1Result {
  const result = cornieApi.useGetGamesV1Query(
    getGamesV1Args,
    subscriptionOptions,
  );

  return { result: mapUseQueryHookResultV2(result) };
}
