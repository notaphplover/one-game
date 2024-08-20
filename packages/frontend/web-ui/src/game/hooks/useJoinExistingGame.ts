import { models as apiModels } from '@cornie-js/api-models';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { JoinExistingGameStatus } from '../models/JoinExistingGameStatus';
import { UseJoinExistingGameResult } from '../models/UseJoinExistingGameResult';

export const UNEXPECTED_ERROR_MESSAGE: string = 'Unexpected error';

export const useJoinExistingGame = (): UseJoinExistingGameResult => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<JoinExistingGameStatus>(
    JoinExistingGameStatus.idle,
  );

  const url: URL = new URL(window.location.href);
  const gameIdParam: string | null = url.searchParams.get('gameId');

  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  const useGetUsersV1MeQueryResult = cornieApi.useGetUsersV1MeQuery({
    params: [],
  });

  const usersV1MeResult: Either<string, apiModels.UserV1> | null =
    mapUseQueryHookResult(useGetUsersV1MeQueryResult);

  const [triggerCreateGameSlot, gameSlotCreatedResult] =
    cornieApi.useCreateGamesV1SlotsMutation();

  useEffect(() => {
    void (async () => {
      switch (status) {
        case JoinExistingGameStatus.idle:
          if (gameIdParam === null) {
            setStatus(JoinExistingGameStatus.rejected);
            setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
          } else {
            setStatus(JoinExistingGameStatus.pending);
          }
          break;
        case JoinExistingGameStatus.pending:
          if (
            usersV1MeResult !== null &&
            auth !== null &&
            gameIdParam !== null
          ) {
            if (usersV1MeResult.isRight) {
              void triggerCreateGameSlot({
                params: [
                  { gameId: gameIdParam },
                  { userId: usersV1MeResult.value.id },
                ],
              });

              setStatus(JoinExistingGameStatus.pendingBackend);
            } else {
              setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
              setStatus(JoinExistingGameStatus.rejected);
            }
          }
          break;
        default:
      }
    })();
  }, [status, useGetUsersV1MeQueryResult]);

  useEffect(() => {
    switch (gameSlotCreatedResult.status) {
      case QueryStatus.fulfilled:
        setStatus(JoinExistingGameStatus.fulfilled);
        break;
      case QueryStatus.rejected:
        setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
        setStatus(JoinExistingGameStatus.rejected);
        break;
      default:
    }
  }, [gameSlotCreatedResult]);

  return {
    errorMessage,
    status,
  };
};
