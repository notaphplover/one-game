import { models as apiModels } from '@cornie-js/api-models';
import {
  GetUsersV1Args,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

export type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};
export interface UseGetUsersV1Result {
  result: Either<
    SerializableAppError | SerializedError,
    apiModels.MaybeUserArrayV1
  > | null;
}

export const useGetUsersV1 = (
  getUsersV1Args: GetUsersV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetUsersV1Result => {
  const result = cornieApi.useGetUsersV1Query(
    getUsersV1Args,
    subscriptionOptions,
  );

  return { result: mapUseQueryHookResultV2(result) };
};
