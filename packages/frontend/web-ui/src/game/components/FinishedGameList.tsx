import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { SerializedError } from '@reduxjs/toolkit';

import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { Either } from '../../common/models/Either';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { BaseGameList, BaseGameListPaginationOptions } from './BaseGameList';
import { FinishedGameListItem } from './FinishedGameListItem';

export interface FinishedGameListOptions {
  pagination?: BaseGameListPaginationOptions | undefined;
  title?: string | undefined;
  gameResourcesListResult: Either<
    SerializableAppError | SerializedError,
    GameWithWinnerUserPair[]
  > | null;
}

function getCreateErrorMessage(
  error: SerializableAppError | SerializedError,
): string {
  if (!isSerializableAppError(error)) {
    return (
      error.message ??
      'An error has ocurred. Is not possible to find any games.'
    );
  }

  let resultErrorMessage: string;

  switch (error.kind) {
    case AppErrorKind.contractViolation:
      resultErrorMessage =
        'Unexpected error occurred while processing the request.';
      break;
    case AppErrorKind.missingCredentials:
      resultErrorMessage = 'Missing credentials.';
      break;
    case AppErrorKind.invalidCredentials:
      resultErrorMessage = 'Invalid credentials.';
      break;
    default:
      resultErrorMessage =
        'An error has ocurred. Is not possible to find any games.';
  }

  return resultErrorMessage;
}

function buildGameItem(
  gameWithWinnerUser: GameWithWinnerUserPair,
  key: number,
): React.JSX.Element {
  return (
    <FinishedGameListItem key={key} gameWithWinnerUser={gameWithWinnerUser} />
  );
}

function getGameResourcesListResult(
  gameResources: Either<
    SerializableAppError | SerializedError,
    GameWithWinnerUserPair[]
  > | null,
): Either<string, GameWithWinnerUserPair[]> | null {
  if (gameResources !== null) {
    if (gameResources.isRight) {
      return gameResources;
    } else {
      return {
        isRight: false,
        value: getCreateErrorMessage(gameResources.value),
      };
    }
  } else {
    return null;
  }
}

export const FinishedGameList = (options: FinishedGameListOptions) => {
  return (
    <BaseGameList
      buildGameItem={buildGameItem}
      pagination={options.pagination}
      gameResourcesListResult={getGameResourcesListResult(
        options.gameResourcesListResult,
      )}
      title={options.title}
    />
  );
};
