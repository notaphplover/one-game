import { AppErrorKind } from '@cornie-js/frontend-common';

import {
  HTTP_FORBIDDEN_UPD_USER_ME_ERROR_MESSAGE,
  HTTP_UNAUTHORIZED_UPD_USER_ME_ERROR_MESSAGE,
  UNEXPECTED_UPD_USER_ME_ERROR_MESSAGE,
} from './updateUserMeErrorMessage';

export function getUpdateUserMeErrorMessage(
  errorKind: AppErrorKind | undefined,
): string {
  let resultErrorMessage: string;

  switch (errorKind) {
    case AppErrorKind.invalidCredentials:
      resultErrorMessage = HTTP_FORBIDDEN_UPD_USER_ME_ERROR_MESSAGE;
      break;
    case AppErrorKind.missingCredentials:
      resultErrorMessage = HTTP_UNAUTHORIZED_UPD_USER_ME_ERROR_MESSAGE;
      break;
    default:
      resultErrorMessage = UNEXPECTED_UPD_USER_ME_ERROR_MESSAGE;
  }

  return resultErrorMessage;
}
