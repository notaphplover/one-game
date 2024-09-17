import { models as apiModels } from '@cornie-js/api-models';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

export interface UseGetUserMeResult {
  result: Either<string, apiModels.UserV1> | null;
}

export function useGetUserMe(): UseGetUserMeResult {
  const useGetUsersV1MeQueryResult = cornieApi.useGetUsersV1MeQuery({
    params: [],
  });

  const result: Either<string, apiModels.UserV1> | null = mapUseQueryHookResult(
    useGetUsersV1MeQueryResult,
  );

  return { result };
}
