import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesGameIdSpecsV1Args,
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

function useGetGamesGameIdSpecsV1(
  getGamesSpecsV1Args: GetGamesGameIdSpecsV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): {
  result: Either<
    SerializableAppError | SerializedError,
    apiModels.GameSpecV1
  > | null;
} {
  const result = cornieApi.useGetGamesGameIdSpecsV1Query(
    getGamesSpecsV1Args,
    subscriptionOptions,
  );

  return { result: mapUseQueryHookResultV2(result) };
}

export interface UseGetGameSpecV1Result {
  result: Either<
    SerializableAppError | SerializedError,
    apiModels.GameSpecV1
  > | null;
}

export const useGetGameSpecV1 = (
  gameId: string | undefined,
): UseGetGameSpecV1Result => {
  return useGetGamesGameIdSpecsV1(
    {
      params: [
        {
          gameId: gameId ?? '',
        },
      ],
    },
    {
      skip: gameId === undefined,
    },
  );
};
