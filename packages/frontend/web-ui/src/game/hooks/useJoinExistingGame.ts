import { useEffect, useState } from 'react';

import { JoinExistingGameStatus } from '../models/JoinExistingGameStatus';
import { UseJoinExistingGameResult } from '../models/UseJoinExistingGameResult';

export const UNEXPECTED_ERROR_MESSAGE: string = 'Unexpected error.';

export const useJoinExistingGame = (): UseJoinExistingGameResult => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [status, setStatus] = useState<JoinExistingGameStatus>(
    JoinExistingGameStatus.idle,
  );

  const url: URL = new URL(window.location.href);
  const gameIdParam: string | null = url.searchParams.get('gameId');

  useEffect(() => {
    switch (status) {
      case JoinExistingGameStatus.idle:
        if (gameIdParam === null) {
          setStatus(JoinExistingGameStatus.rejected);
          setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
        } else {
          setStatus(JoinExistingGameStatus.pending);
          setRedirectTo(url.href);
          console.log(url.href);
        }
        break;

      default:
        break;
    }
  }, [status]);

  return {
    errorMessage,
    redirectTo,
    status,
  };
};
