import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';

import { useGetUser, UseGetUserResult } from '../../user/hooks/useGetUser';

export interface UseGetFinishedGameWinnerResult {
  endGameWinner: apiModels.UserV1 | undefined;
}

export const useGetFinishedGameWinner = (
  game: apiModels.GameV1 | undefined,
): UseGetFinishedGameWinnerResult => {
  const [endGameWinner, setEndGameWinner] = useState<
    apiModels.UserV1 | undefined
  >(undefined);

  const getWinnerUserId = (
    game: apiModels.GameV1 | undefined,
  ): string | undefined => {
    let selectedUserId: string | undefined = undefined;

    if (game?.state.status === 'finished') {
      game.state.slots.forEach(
        (finishGameSlot: apiModels.FinishedGameSlotV1) => {
          if (finishGameSlot.cardsAmount === 0) {
            selectedUserId = finishGameSlot.userId;
          }
        },
      );
    }
    return selectedUserId;
  };

  const {
    queryResult: userV1QueryResult,
    result: userV1Result,
  }: UseGetUserResult = useGetUser(getWinnerUserId(game));

  useEffect(() => {
    if (game?.state.status === 'finished') {
      if (userV1Result !== null) {
        if (userV1Result.isRight) {
          setEndGameWinner(userV1Result.value);
        }
      }
    }
  }, [userV1QueryResult]);

  return {
    endGameWinner,
  };
};
