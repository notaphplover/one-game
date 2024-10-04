import { AppErrorKind } from '@cornie-js/frontend-common';

import {
  HTTP_BAD_REQUEST_USER_ERROR_MESSAGE,
  HTTP_CONFLICT_USER_ERROR_MESSAGE,
  UNEXPECTED_USER_ERROR_MESSAGE,
} from './createUserErrorMessages';

export function getCreateUserErrorMessage(
  errorKind: AppErrorKind | undefined,
): string {
  let resultErrorMessage: string;

  switch (errorKind) {
    case AppErrorKind.contractViolation:
      resultErrorMessage = HTTP_BAD_REQUEST_USER_ERROR_MESSAGE;
      break;
    case AppErrorKind.entityConflict:
      resultErrorMessage = HTTP_CONFLICT_USER_ERROR_MESSAGE;
      break;
    default:
      resultErrorMessage = UNEXPECTED_USER_ERROR_MESSAGE;
  }

  return resultErrorMessage;
}
