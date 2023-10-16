import { AppError, Builder } from '@cornie-js/backend-common';
import { HttpStatusCodeFromErrorBuilder } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';

const GRAPHQL_API_ERROR_CODE: string = 'API_ERROR';

@Injectable()
export class GraphQlErrorFromAppErrorBuilder
  implements Builder<GraphQLError, [AppError]>
{
  readonly #httpStatusCodeFromErrorBuilder: Builder<number, [AppError]>;

  constructor(
    @Inject(HttpStatusCodeFromErrorBuilder)
    httpStatusCodeFromErrorBuilder: Builder<number, [AppError]>,
  ) {
    this.#httpStatusCodeFromErrorBuilder = httpStatusCodeFromErrorBuilder;
  }

  public build(error: AppError): GraphQLError {
    return new GraphQLError(error.message, {
      extensions: {
        code: GRAPHQL_API_ERROR_CODE,
        http: {
          status: this.#httpStatusCodeFromErrorBuilder.build(error),
        },
      },
    });
  }
}
