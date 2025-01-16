import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { SerializedError } from '@reduxjs/toolkit';

import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';

export function getGamesV1ErrorMessage(
  error: SerializableAppError | SerializedError,
): string {
  if (!isSerializableAppError(error)) {
    return 'An error has ocurred. Is not possible to find any games.';
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
