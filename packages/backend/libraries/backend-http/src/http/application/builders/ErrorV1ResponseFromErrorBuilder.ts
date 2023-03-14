import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';
import httpStatusCodes from 'http-status-codes';

import { ResponseWithBody } from '../models/ResponseWithBody';
import { ResponseBuilder } from './ResponseBuilder';

export class ErrorV1ResponseFromErrorBuilder
  extends ResponseBuilder<[unknown]>
  implements Builder<ResponseWithBody<apiModels.ErrorV1>, [unknown]>
{
  public build(error: unknown): ResponseWithBody<apiModels.ErrorV1> {
    let httpResponse: ResponseWithBody<apiModels.ErrorV1>;

    if (error instanceof Error) {
      httpResponse = this.#buildHttpResponseFromError(error);
    } else {
      httpResponse = this.#buildHttpResponseFromUnexpectedValue();
    }

    return httpResponse;
  }

  #buildHttpResponseFromError(
    error: Error,
  ): ResponseWithBody<apiModels.ErrorV1> {
    let httpResponse: ResponseWithBody<apiModels.ErrorV1>;

    if (AppError.isAppError(error)) {
      httpResponse = this.#buildHttpResponseFromAppError(error);
    } else {
      const appError: AppError = new AppError(
        AppErrorKind.unknown,
        error.message,
        {
          cause: error,
        },
      );

      httpResponse = this.#buildHttpResponseFromAppError(appError);
    }

    return httpResponse;
  }

  #buildHttpResponseFromAppError(
    error: AppError,
  ): ResponseWithBody<apiModels.ErrorV1> {
    let statusCode: number;
    let errorMessage: string;

    switch (error.kind) {
      case AppErrorKind.contractViolation:
        statusCode = httpStatusCodes.BAD_REQUEST;
        errorMessage = this.#stringifyError(error);
        break;
      case AppErrorKind.entityConflict:
        statusCode = httpStatusCodes.CONFLICT;
        errorMessage = this.#stringifyError(error);
        break;
      case AppErrorKind.invalidCredentials:
        statusCode = httpStatusCodes.FORBIDDEN;
        errorMessage = this.#stringifyError(error);
        break;
      case AppErrorKind.missingCredentials:
        statusCode = httpStatusCodes.UNAUTHORIZED;
        errorMessage = this.#stringifyError(error);
        break;
      case AppErrorKind.unknown:
        statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
        errorMessage = this.#stringifyError(error);
        break;
      case AppErrorKind.unprocessableOperation:
        statusCode = httpStatusCodes.UNPROCESSABLE_ENTITY;
        errorMessage = this.#stringifyError(error);
        break;
    }

    return {
      body: {
        description: errorMessage,
      },
      headers: this._getHttpResponseHeaders(),
      statusCode,
    };
  }

  #buildHttpResponseFromUnexpectedValue(): ResponseWithBody<apiModels.ErrorV1> {
    return {
      body: {
        description: 'Unexpected error occurred while processing the request.',
      },
      headers: this._getHttpResponseHeaders(),
      statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  #stringifyError(error: Error): string {
    return error.message;
  }
}
