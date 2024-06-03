import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { selectFulfilledUser } from '../../app/store/features/userSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { FulfilledUserState } from '../../app/store/helpers/models/UserState';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { getUserMe } from '../../app/store/thunk/getUserMe';
import { JoinExistingGameStatus } from '../models/JoinExistingGameStatus';
import { UseJoinExistingGameResult } from '../models/UseJoinExistingGameResult';
import { useJoinGame } from './useJoinGame';
import { UseJoinGameParams } from './useJoinGame/models/UseJoinGameParams';

export const UNEXPECTED_ERROR_MESSAGE: string = 'Unexpected error.';

function buildLoginPageUrl(redirectTo: string): string {
  return `/auth/login?redirectTo=${redirectTo}`;
}

export const useJoinExistingGame = (): UseJoinExistingGameResult => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<JoinExistingGameStatus>(
    JoinExistingGameStatus.idle,
  );

  const url: URL = new URL(window.location.href);
  const gameIdParam: string | null = url.searchParams.get('gameId');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );
  const user: FulfilledUserState | null = useAppSelector(selectFulfilledUser);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { call: callJoinGame, result: resultJoinGame } = useJoinGame();

  useEffect(() => {
    void (async () => {
      switch (status) {
        case JoinExistingGameStatus.idle:
          if (gameIdParam === null) {
            setStatus(JoinExistingGameStatus.rejected);
            setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            break;
          } else {
            if (auth === null) {
              navigate(buildLoginPageUrl(url.toString()));
            }
            if (user === null && auth !== null) {
              await dispatch(getUserMe(auth.accessToken));
            }
          }
          setStatus(JoinExistingGameStatus.pending);
          break;
        case JoinExistingGameStatus.pending:
          if (user !== null && auth !== null && gameIdParam !== null) {
            const paramGameId: UseJoinGameParams = {
              gameId: gameIdParam,
            };
            callJoinGame(paramGameId);
          }
          setStatus(JoinExistingGameStatus.pendingBackend);
          break;
        case JoinExistingGameStatus.pendingBackend:
          if (resultJoinGame !== null) {
            if (resultJoinGame.isRight) {
              setStatus(JoinExistingGameStatus.fulfilled);
            } else {
              setStatus(JoinExistingGameStatus.rejected);
              setErrorMessage(resultJoinGame.value);
            }
          }
          break;
        default:
          break;
      }
    })();
  }, [status, resultJoinGame]);

  return {
    errorMessage,
    status,
  };
};
