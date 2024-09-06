import { models as apiModels } from '@cornie-js/api-models';

import { Either, Left } from '../../common/models/Either';
import { GameWithSpecPair } from '../models/GameWithSpecPair';

export function buildGameWithSpecPairArrayResult(
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
