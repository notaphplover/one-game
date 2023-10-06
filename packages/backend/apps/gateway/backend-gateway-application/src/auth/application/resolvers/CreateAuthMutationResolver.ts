/* eslint-disable @typescript-eslint/no-magic-numbers */
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Injectable()
export class CreateAuthMutationResolver
  implements
    Omit<graphqlModels.CreateAuthMutationResolvers<Request>, '__resolveType'>
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
        throw new GraphQLError(httpResponse.body.description, {
          extensions: {
            http: {
              status: httpResponse.statusCode,
            },
          },
        });
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
        throw new GraphQLError(httpResponse.body.description, {
          extensions: {
            http: {
              status: httpResponse.statusCode,
            },
          },
        });
    }
  }
}
