import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';

import { useGetUser, UseGetUserResult } from '../../user/hooks/useGetUser';
import { getWinnerUserId } from '../helpers/getWinnerUserId';

export interface UseGetFinishedGameWinnerResult {
  finishedGameWinner: apiModels.UserV1 | undefined;
}

export const useGetFinishedGameWinner = (
  game: apiModels.GameV1 | undefined,
): UseGetFinishedGameWinnerResult => {
  const [finishedGameWinner, setFinishedGameWinner] = useState<
    apiModels.UserV1 | undefined
  >(undefined);

  const {
    queryResult: userV1QueryResult,
    result: userV1Result,
  }: UseGetUserResult = useGetUser(getWinnerUserId(game));

  useEffect(() => {
    if (game?.state.status === 'finished') {
      if (userV1Result !== null) {
        if (userV1Result.isRight) {
          setFinishedGameWinner(userV1Result.value);
        }
      }
    }
  }, [userV1QueryResult]);

  return {
    finishedGameWinner,
  };
};
