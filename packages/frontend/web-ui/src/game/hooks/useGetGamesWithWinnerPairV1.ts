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
import { buildGameWithWinnerUserPairArrayResult } from '../helpers/buildGameWithWinnerUserPairArrayResult';
import { getGamesV1ErrorMessage } from '../helpers/getGamesV1ErrorMessage';
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
  let games: Either<string, apiModels.GameArrayV1> | null = null;

  const result = cornieApi.useGetGamesV1Query(
    getGamesV1Args,
    subscriptionOptions,
  );

  const resultMapUseQueryHookResultV2: Either<
    SerializableAppError | SerializedError,
    apiModels.GameArrayV1
  > | null = mapUseQueryHookResultV2(result);

  if (resultMapUseQueryHookResultV2 !== null) {
    if (resultMapUseQueryHookResultV2.isRight) {
      games = {
        isRight: true,
        value: resultMapUseQueryHookResultV2.value,
      };
    } else {
      games = {
        isRight: false,
        value: getGamesV1ErrorMessage(resultMapUseQueryHookResultV2.value),
      };
    }
  }

  return { result: games };
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
