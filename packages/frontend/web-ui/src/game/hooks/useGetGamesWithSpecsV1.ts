import { models as apiModels } from '@cornie-js/api-models';
import { GetGamesV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { buildGameWithSpecPairArrayResult } from '../helpers/buildGameWithSpecPairArrayResult';
import { GameWithSpecPair } from '../models/GameWithSpecPair';
import { useGetGameSpecsV1ForGames } from './useGetGameSpecsV1ForGames';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

export interface UseGetGamesWithSpecsV1Result {
  result: Either<string, GameWithSpecPair[]> | null;
}

function useGetGamesV1(
  getGamesV1Args: GetGamesV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): {
  result: Either<string, apiModels.GameArrayV1> | null;
} {
  const result = cornieApi.useGetGamesV1Query(
    getGamesV1Args,
    subscriptionOptions,
  );

  return { result: mapUseQueryHookResult(result) };
}

export const useGetGamesWithSpecsV1 = (
  getGamesV1Args: GetGamesV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetGamesWithSpecsV1Result => {
  const { result: gamesV1Result } = useGetGamesV1(
    getGamesV1Args,
    subscriptionOptions,
  );

  const { result: gamesSpecsV1Result } = useGetGameSpecsV1ForGames(
    gamesV1Result,
    subscriptionOptions,
  );

  return {
    result: buildGameWithSpecPairArrayResult(gamesV1Result, gamesSpecsV1Result),
  };
};
