import { models as apiModels } from '@cornie-js/api-models';
import { GetGamesV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { buildGameWithWinnerUserPairArrayResult } from '../helpers/buildGameWithWinnerUserPairArrayResult';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { useGetWinnerUserV1ForGames } from './useGetWinnerUserV1ForGames';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

export interface UseGetGamesWithWinnerPairV1Result {
  result: Either<string, GameWithWinnerUserPair[]> | null;
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

export const useGetGamesWithWinnerPairV1 = (
  getGamesV1Args: GetGamesV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetGamesWithWinnerPairV1Result => {
  const { result: gamesV1Result } = useGetGamesV1(
    getGamesV1Args,
    subscriptionOptions,
  );

  const { result: winnerUserV1Result } = useGetWinnerUserV1ForGames(
    gamesV1Result,
    subscriptionOptions,
  );

  return {
    result: buildGameWithWinnerUserPairArrayResult(
      gamesV1Result,
      winnerUserV1Result,
    ),
  };
};
