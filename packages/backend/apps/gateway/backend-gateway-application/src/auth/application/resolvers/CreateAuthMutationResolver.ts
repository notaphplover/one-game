/* eslint-disable @typescript-eslint/no-magic-numbers */
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateAuthMutationResolver
  implements graphqlModels.CreateAuthMutationResolvers<Request>
{
  readonly #httpClient: HttpClient;

  constructor(@Inject(HttpClient) httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async createAuthByCode(
    _: unknown,
    args: graphqlModels.CreateAuthMutationCreateAuthByCodeArgs,
    request: Request,
  ): Promise<graphqlModels.Auth> {
    const httpResponse: Awaited<ReturnType<HttpClient['createAuth']>> =
      await this.#httpClient.createAuth(request.headers, {
        code: args.codeAuthCreateInput.code,
      });

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
      case 400:
      case 422:
        throw new AppError(
          AppErrorKind.unprocessableOperation,
          httpResponse.body.description,
        );
    }
  }

  public async createAuthByCredentials(
    _: unknown,
    args: graphqlModels.CreateAuthMutationCreateAuthByCredentialsArgs,
    request: Request,
  ): Promise<graphqlModels.Auth> {
    const httpResponse: Awaited<ReturnType<HttpClient['createAuth']>> =
      await this.#httpClient.createAuth(request.headers, {
        email: args.emailPasswordAuthCreateInput.email,
        password: args.emailPasswordAuthCreateInput.password,
      });

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
      case 400:
      case 422:
        throw new AppError(
          AppErrorKind.unprocessableOperation,
          httpResponse.body.description,
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public __resolveType(): never {
    throw new Error('Method not implemented');
  }
}
