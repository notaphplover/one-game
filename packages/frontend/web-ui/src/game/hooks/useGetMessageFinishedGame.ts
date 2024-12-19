import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';

import { useGetUser, UseGetUserResult } from '../../user/hooks/useGetUser';

export interface UseGetMessageFinishedGameResult {
  messageFinishedGame: string | undefined;
}

export const useGetMessageFinishedGame = (
  game: apiModels.GameV1 | undefined,
): UseGetMessageFinishedGameResult => {
  const [messageEndGame, setMessageEndGame] = useState<string | undefined>(
    undefined,
  );

  const getWinnerUser = (
    game: apiModels.GameV1 | undefined,
  ): string | undefined => {
    let userIdSelected: string | undefined = undefined;

    if (game?.state.status === 'finished') {
      game.state.slots.forEach((finishGame: apiModels.FinishedGameSlotV1) => {
        if (finishGame.cardsAmount === 0) {
          userIdSelected = finishGame.userId;
        }
      });
    }
    return userIdSelected;
  };

  const {
    queryResult: userV1QueryResult,
    result: userV1Result,
  }: UseGetUserResult = useGetUser(getWinnerUser(game));

  useEffect(() => {
    if (game?.state.status === 'finished') {
      if (userV1Result !== null) {
        if (userV1Result.isRight) {
          setMessageEndGame(
            `Finished game, the winner is ${userV1Result.value.name}`,
          );
        }
      }
    }
  }, [userV1QueryResult]);

  return {
    messageFinishedGame: messageEndGame,
  };
};
