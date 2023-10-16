import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { HttpStatusCodeFromErrorBuilder } from '@cornie-js/backend-http';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';

const GRAPHQL_API_ERROR_CODE: string = 'API_ERROR';

@Injectable()
export class GraphQlErrorFromErrorBuilder
  implements Builder<GraphQLError, [unknown]>
{
  readonly #httpStatusCodeFromErrorBuilder: Builder<number, [AppError]>;

  constructor(
    @Inject(HttpStatusCodeFromErrorBuilder)
    httpStatusCodeFromErrorBuilder: Builder<number, [AppError]>,
  ) {
    this.#httpStatusCodeFromErrorBuilder = httpStatusCodeFromErrorBuilder;
  }

  public build(error: unknown): GraphQLError {
    if (this.#isAppError(error)) {
      return new GraphQLError(error.message, {
        extensions: {
          code: GRAPHQL_API_ERROR_CODE,
          http: {
            status: this.#httpStatusCodeFromErrorBuilder.build(error),
          },
        },
      });
    }

    return new GraphQLError('Unknown error', {
      extensions: {
        http: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      },
    });
  }

  #isAppError(error: unknown): error is AppError {
    return (
      error !== null &&
      typeof error === 'object' &&
      Object.values(AppErrorKind).includes((error as AppError).kind)
    );
  }
}
