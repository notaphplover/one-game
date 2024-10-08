import { models as apiModels } from '@cornie-js/api-models';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

export interface UseGetGamesV1GameIdResult {
  queryResult: unknown;
  result: Either<string, apiModels.GameV1> | null;
}

export function useGetGamesV1GameId(
  gameId: string | undefined,
): UseGetGamesV1GameIdResult {
  const useGetUsersV1MeQueryResult = cornieApi.useGetGamesV1GameIdQuery(
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

  const result: Either<string, apiModels.GameV1> | null = mapUseQueryHookResult(
    useGetUsersV1MeQueryResult,
  );

  return { queryResult: useGetUsersV1MeQueryResult, result };
}
