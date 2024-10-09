import { AppErrorKind } from '@cornie-js/frontend-common';

import {
  HTTP_CONFLICT_USERCODE_ERROR_MESSAGE,
  HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE,
  UNEXPECTED_USERCODE_ERROR_MESSAGE,
} from './createUserCodeErrorMessage';

export function getCreateUserCodeErrorMessage(
  errorKind: AppErrorKind | undefined,
): string {
  let resultErrorMessage: string;

  switch (errorKind) {
    case AppErrorKind.entityConflict:
      resultErrorMessage = HTTP_CONFLICT_USERCODE_ERROR_MESSAGE;
      break;
    case AppErrorKind.unprocessableOperation:
      resultErrorMessage = HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE;
      break;
    default:
      resultErrorMessage = UNEXPECTED_USERCODE_ERROR_MESSAGE;
  }

  return resultErrorMessage;
}
