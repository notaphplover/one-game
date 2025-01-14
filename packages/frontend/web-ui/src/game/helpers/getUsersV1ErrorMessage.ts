import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { SerializedError } from '@reduxjs/toolkit';

import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';

export function getUsersV1ErrorMessage(
  error: SerializableAppError | SerializedError,
): string {
  if (!isSerializableAppError(error)) {
    return 'An error has ocurred. Is not possible to find any winner user.';
  }

  let resultErrorMessage: string;

  switch (error.kind) {
    case AppErrorKind.missingCredentials:
      resultErrorMessage = 'Missing credentials.';
      break;
    case AppErrorKind.invalidCredentials:
      resultErrorMessage = 'Invalid credentials.';
      break;
    default:
      resultErrorMessage =
        'An error has ocurred. Is not possible to find any winner user.';
  }

  return resultErrorMessage;
}
