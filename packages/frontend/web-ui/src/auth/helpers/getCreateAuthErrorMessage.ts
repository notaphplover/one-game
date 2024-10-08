import { AppErrorKind } from '@cornie-js/frontend-common';

import {
  HTTP_BAD_REQUEST_AUTH_ERROR_MESSAGE,
  HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE,
  UNEXPECTED_AUTH_ERROR_MESSAGE,
} from './createAuthErrorMessages';

export function getCreateAuthErrorMessage(
  errorKind: AppErrorKind | undefined,
): string {
  let resultErrorMessage: string;

  switch (errorKind) {
    case AppErrorKind.contractViolation:
      resultErrorMessage = HTTP_BAD_REQUEST_AUTH_ERROR_MESSAGE;
      break;
    case AppErrorKind.missingCredentials:
      resultErrorMessage = HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE;
      break;
    default:
      resultErrorMessage = UNEXPECTED_AUTH_ERROR_MESSAGE;
  }

  return resultErrorMessage;
}
