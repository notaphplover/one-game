import {
  GetGamesV1Args,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { Either } from '../../common/models/Either';
import { buildGameWithWinnerUserPairArrayResult } from '../helpers/buildGameWithWinnerUserPairArrayResult';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { useGetGamesV1 } from './useGetGamesV1';
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
