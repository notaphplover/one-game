import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesSpecsV1Args,
  GetGamesV1Args,
} from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either, Left } from '../../common/models/Either';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

export interface GameWithSpecPair {
  game: apiModels.GameV1;
  spec: apiModels.GameSpecV1;
}

export interface UseGetGamesWithSpecsV1Result {
  result: Either<string, GameWithSpecPair[]> | null;
}

function buildGameWithSpecPairArrayResult(
  gamesV1Result: Either<string, apiModels.GameArrayV1> | null,
  gamesSpecsV1Result: Either<string, apiModels.GameSpecArrayV1> | null,
): Either<string, GameWithSpecPair[]> | null {
  if (gamesSpecsV1Result === null || gamesV1Result === null) {
    return null;
  }

  if (!gamesSpecsV1Result.isRight || !gamesV1Result.isRight) {
    const leftovers: string[] = [gamesV1Result, gamesSpecsV1Result]
      .filter(
        (result: Either<string, unknown>): result is Left<string> =>
          !result.isRight,
      )
      .map((result: Left<string>): string => result.value);

    return {
      isRight: false,
      value: leftovers.join('\n'),
    };
  }

  if (gamesV1Result.value.length !== gamesSpecsV1Result.value.length) {
    return {
      isRight: false,
      value: 'Unable to fetch games data',
    };
  }

  const gameWithSpecPairArray: GameWithSpecPair[] = gamesV1Result.value.map(
    (gameV1: apiModels.GameV1, index: number): GameWithSpecPair => {
      const gameSpecV1: apiModels.GameSpecV1 = gamesSpecsV1Result.value[
        index
      ] as apiModels.GameSpecV1;

      return {
        game: gameV1,
        spec: gameSpecV1,
      };
    },
  );

  return {
    isRight: true,
    value: gameWithSpecPairArray,
  };
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

function useGetGamesSpecsV1(
  getGamesV1Args: GetGamesSpecsV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): {
  result: Either<string, apiModels.GameSpecArrayV1> | null;
} {
  const result = cornieApi.useGetGamesSpecsV1Query(
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

  const gameIds: string[] =
    gamesV1Result?.isRight === true
      ? gamesV1Result.value.map((gameV1: apiModels.GameV1): string => gameV1.id)
      : [];

  const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';

  const { result: gamesSpecsV1Result } = useGetGamesSpecsV1(
    {
      params: [
        {
          gameId: gameIds,
          sort: gameSpecSortOptionV1,
        },
      ],
    },
    {
      ...subscriptionOptions,
      skip: gameIds.length === 0,
    },
  );

  return {
    result: buildGameWithSpecPairArrayResult(gamesV1Result, gamesSpecsV1Result),
  };
};
