import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';

import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

export interface UseGetUserResult {
  queryResult: unknown;
  result: Either<
    SerializableAppError | SerializedError,
    apiModels.UserV1
  > | null;
}

export function useGetUser(userId: string | undefined): UseGetUserResult {
  const useGetUserV1QueryResult = cornieApi.useGetUserV1Query({
    params: [{ userId: userId ?? '' }],
  });

  const result: Either<
    SerializableAppError | SerializedError,
    apiModels.UserV1
  > | null = mapUseQueryHookResultV2(useGetUserV1QueryResult);

  return {
    queryResult: useGetUserV1QueryResult,
    result,
  };
}
