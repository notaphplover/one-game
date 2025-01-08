import { models as apiModels } from '@cornie-js/api-models';

import { Either, Left } from '../../common/models/Either';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';

export function buildGameWithWinnerUserPairArrayResult(
  gamesV1Result: Either<string, apiModels.GameArrayV1> | null,
  winnerUserV1Result: Either<string, apiModels.MaybeUserArrayV1> | null,
): Either<string, GameWithWinnerUserPair[]> | null {
  if (winnerUserV1Result === null || gamesV1Result === null) {
    return null;
  }

  if (!winnerUserV1Result.isRight || !gamesV1Result.isRight) {
    const leftovers: string[] = [gamesV1Result, winnerUserV1Result]
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

  if (gamesV1Result.value.length !== winnerUserV1Result.value.length) {
    return {
      isRight: false,
      value: 'Unable to fetch games data',
    };
  }

  const gameWithWinnerUserPairArray: GameWithWinnerUserPair[] =
    gamesV1Result.value.map(
      (gameV1: apiModels.GameV1, index: number): GameWithWinnerUserPair => {
        const winnerUserV1: apiModels.UserV1 | null = winnerUserV1Result.value[
          index
        ] as unknown as apiModels.UserV1 | null;

        return {
          game: gameV1,
          winnerUser: winnerUserV1,
        };
      },
    );

  return {
    isRight: true,
    value: gameWithWinnerUserPairArray,
  };
}
