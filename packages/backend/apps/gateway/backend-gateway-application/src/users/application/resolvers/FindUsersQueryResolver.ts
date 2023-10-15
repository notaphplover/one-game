/* eslint-disable @typescript-eslint/no-magic-numbers */

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FindUsersQueryResolver
  implements graphqlModels.FindUsersQueryResolvers<Request>
{
  readonly #httpClient: HttpClient;

  constructor(@Inject(HttpClient) httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async userById(
    _: unknown,
    args: graphqlModels.FindUsersQueryUserByIdArgs,
    request: Request,
  ): Promise<graphqlModels.User | null> {
    const httpResponse: Awaited<ReturnType<HttpClient['getUser']>> =
      await this.#httpClient.getUser(request.headers, {
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
}
