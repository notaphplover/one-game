/* eslint-disable @typescript-eslint/no-magic-numbers */
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Injectable()
export class CreateUserMutationResolver
  implements
    Omit<graphqlModels.CreateUserMutationResolvers<Request>, '__resolveType'>
{
  readonly #httpClient: HttpClient;

  constructor(@Inject(HttpClient) httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async createUser(
    _: unknown,
    args: graphqlModels.CreateUserMutationCreateUserArgs,
    request: Request,
  ): Promise<graphqlModels.User> {
    const httpResponse: Awaited<ReturnType<HttpClient['createUser']>> =
      await this.#httpClient.createUser(request.headers, {
        email: args.userCreateInput.email,
        name: args.userCreateInput.name,
        password: args.userCreateInput.password,
      });

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
      case 400:
      case 409:
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
