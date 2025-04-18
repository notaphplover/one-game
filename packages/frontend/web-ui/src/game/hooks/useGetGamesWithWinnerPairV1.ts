import {
  GetGamesV1MineArgs,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { Either } from '../../common/models/Either';
import { buildGameWithWinnerUserPairArrayResult } from '../helpers/buildGameWithWinnerUserPairArrayResult';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { useGetGamesV1Mine } from './useGetGamesV1Mine';
import { useGetWinnerUserV1ForGames } from './useGetWinnerUserV1ForGames';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

export interface UseGetGamesWithWinnerPairV1Result {
  result: Either<
    SerializableAppError | SerializedError,
    GameWithWinnerUserPair[]
  > | null;
}

export const useGetGamesWithWinnerPairV1 = (
  getGamesV1MineArgs: GetGamesV1MineArgs,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetGamesWithWinnerPairV1Result => {
  const { result: gamesV1MineResult } = useGetGamesV1Mine(
    getGamesV1MineArgs,
    subscriptionOptions,
  );

  const { result: winnerUserV1Result } = useGetWinnerUserV1ForGames(
    gamesV1MineResult,
    subscriptionOptions,
  );

  return {
    result: buildGameWithWinnerUserPairArrayResult(
      gamesV1MineResult,
      winnerUserV1Result,
    ),
  };
};
