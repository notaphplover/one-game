import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ResponseWithBody } from '../models/ResponseWithBody';
import { HttpStatusCodeFromErrorBuilder } from './HttpStatusCodeFromErrorBuilder';
import { JsonResponseBuilder } from './JsonResponseBuilder';

@Injectable()
export class ErrorV1ResponseFromErrorBuilder
  extends JsonResponseBuilder<[unknown]>
  implements Builder<ResponseWithBody<apiModels.ErrorV1>, [unknown]>
{
  readonly #httpStatusCodeFromErrorBuilder: Builder<number, [AppError]>;

  constructor(
    @Inject(HttpStatusCodeFromErrorBuilder)
    httpStatusCodeFromErrorBuilder: Builder<number, [AppError]>,
  ) {
    super();

    this.#httpStatusCodeFromErrorBuilder = httpStatusCodeFromErrorBuilder;
  }

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
    const statusCode: number =
      this.#httpStatusCodeFromErrorBuilder.build(error);
    const errorMessage: string = this.#stringifyError(error);

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
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  #stringifyError(error: Error): string {
    return error.message;
  }
}
