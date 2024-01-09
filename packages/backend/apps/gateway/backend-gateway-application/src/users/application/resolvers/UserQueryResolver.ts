/* eslint-disable @typescript-eslint/no-magic-numbers */

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';

@Injectable()
export class UserQueryResolver
  implements CanonicalResolver<graphqlModels.UserQueryResolvers<Context>>
{
  readonly #httpClient: HttpClient;

  constructor(@Inject(HttpClient) httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async userById(
    _: unknown,
    args: graphqlModels.UserQueryUserByIdArgs,
    context: Context,
  ): Promise<graphqlModels.User | null> {
    const httpResponse: Awaited<ReturnType<HttpClient['getUser']>> =
      await this.#httpClient.getUser(context.request.headers, {
        userId: args.id,
      });

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
      case 401:
        throw new AppError(
          AppErrorKind.missingCredentials,
          httpResponse.body.description,
        );
      case 404:
        return null;
    }
  }

  public async userMe(
    _: unknown,
    _args: unknown,
    context: Context,
  ): Promise<graphqlModels.User> {
    const httpResponse: Awaited<ReturnType<HttpClient['getUserMe']>> =
      await this.#httpClient.getUserMe(context.request.headers);

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
      case 401:
        throw new AppError(
          AppErrorKind.missingCredentials,
          httpResponse.body.description,
        );
      case 403:
        throw new AppError(
          AppErrorKind.invalidCredentials,
          httpResponse.body.description,
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public __resolveType(): never {
    throw new Error('Method not implemented');
  }
}
