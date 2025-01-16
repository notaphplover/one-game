import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';

import { Either, Left } from '../../common/models/Either';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';

export function buildGameWithWinnerUserPairArrayResult(
  gamesV1Result: Either<
    SerializableAppError | SerializedError,
    apiModels.GameArrayV1
  > | null,
  winnerUserV1Result: Either<
    SerializableAppError | SerializedError,
    apiModels.MaybeUserArrayV1
  > | null,
): Either<
  SerializableAppError | SerializedError,
  GameWithWinnerUserPair[]
> | null {
  if (winnerUserV1Result === null || gamesV1Result === null) {
    return null;
  }

  if (!winnerUserV1Result.isRight || !gamesV1Result.isRight) {
    const leftovers: string[] = [gamesV1Result, winnerUserV1Result]
      .filter(
        (
          result: Either<SerializableAppError | SerializedError, unknown>,
        ): result is Left<SerializableAppError | SerializedError> =>
          !result.isRight,
      )
      .map(
        (result: Left<SerializableAppError | SerializedError>): string =>
          result.value.message ?? '',
      );

    return {
      isRight: false,
      value: {
        message: leftovers.join('\n'),
      },
    };
  }

  if (gamesV1Result.value.length !== winnerUserV1Result.value.length) {
    const lengthGamesV1Result: string = gamesV1Result.value.length.toString();
    const lengthWinnerUserV1Result: string =
      winnerUserV1Result.value.length.toString();

    return {
      isRight: false,
      value: {
        message: `Unable to fetch games data with winner data. Expected as many games as users. Found ${lengthGamesV1Result} games and ${lengthWinnerUserV1Result} users.`,
      },
    };
  }

  const gameWithWinnerUserPairArray: GameWithWinnerUserPair[] =
    gamesV1Result.value.map(
      (gameV1: apiModels.GameV1, index: number): GameWithWinnerUserPair => {
        const winnerUserV1: apiModels.UserV1 | null | undefined =
          winnerUserV1Result.value[index];

        return {
          game: gameV1,
          winnerUser: winnerUserV1 ?? undefined,
        };
      },
    );

  return {
    isRight: true,
    value: gameWithWinnerUserPairArray,
  };
}
