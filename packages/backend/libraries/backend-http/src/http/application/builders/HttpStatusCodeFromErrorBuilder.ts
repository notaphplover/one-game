import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { HttpStatus, Injectable } from '@nestjs/common';

const APP_ERROR_KIND_TO_HTTP_ERROR_MAP: {
  [TKey in AppErrorKind]: number;
} = {
  [AppErrorKind.contractViolation]: HttpStatus.BAD_REQUEST,
  [AppErrorKind.entityNotFound]: HttpStatus.NOT_FOUND,
  [AppErrorKind.entityConflict]: HttpStatus.CONFLICT,
  [AppErrorKind.invalidCredentials]: HttpStatus.FORBIDDEN,
  [AppErrorKind.missingCredentials]: HttpStatus.UNAUTHORIZED,
  [AppErrorKind.unknown]: HttpStatus.INTERNAL_SERVER_ERROR,
  [AppErrorKind.unprocessableOperation]: HttpStatus.UNPROCESSABLE_ENTITY,
};

@Injectable()
export class HttpStatusCodeFromErrorBuilder
  implements Builder<number, [AppError]>
{
  public build(error: AppError): number {
    return APP_ERROR_KIND_TO_HTTP_ERROR_MAP[error.kind];
  }
}
