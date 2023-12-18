/* eslint-disable @typescript-eslint/no-magic-numbers */
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';

@Injectable()
export class UserMutationResolver
  implements CanonicalResolver<graphqlModels.UserMutationResolvers<Context>>
{
  readonly #httpClient: HttpClient;

  constructor(@Inject(HttpClient) httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async createUser(
    _: unknown,
    args: graphqlModels.UserMutationCreateUserArgs,
    context: Context,
  ): Promise<graphqlModels.User> {
    const httpResponse: Awaited<ReturnType<HttpClient['createUser']>> =
      await this.#httpClient.createUser(context.request.headers, {
        email: args.userCreateInput.email,
        name: args.userCreateInput.name,
        password: args.userCreateInput.password,
      });

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
      case 400:
        throw new AppError(
          AppErrorKind.contractViolation,
          httpResponse.body.description,
        );
      case 409:
        throw new AppError(
          AppErrorKind.entityConflict,
          httpResponse.body.description,
        );
    }
  }

  public async updateUserMe(
    _: unknown,
    args: graphqlModels.UserMutationUpdateUserMeArgs,
    context: Context,
  ): Promise<graphqlModels.User> {
    const httpResponse: Awaited<ReturnType<HttpClient['updateUserMe']>> =
      await this.#httpClient.updateUserMe(
        context.request.headers,
        this.#buildUserMeUpdateQueryV1(args),
      );

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
      case 401:
        throw new AppError(
          AppErrorKind.invalidCredentials,
          httpResponse.body.description,
        );
      case 403:
        throw new AppError(
          AppErrorKind.missingCredentials,
          httpResponse.body.description,
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public __resolveType(): never {
    throw new Error('Method not implemented');
  }

  #buildUserMeUpdateQueryV1(
    args: graphqlModels.UserMutationUpdateUserMeArgs,
  ): apiModels.UserMeUpdateQueryV1 {
    const userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1 = {};

    if (args.userUpdateInput.active != null) {
      if (!args.userUpdateInput.active) {
        throw new AppError(
          AppErrorKind.contractViolation,
          'Expected userUpdateInput.active not to be false',
        );
      }

      userMeUpdateQueryV1.active = args.userUpdateInput.active;
    }

    if (args.userUpdateInput.name !== null) {
      userMeUpdateQueryV1.name = args.userUpdateInput.name;
    }

    return userMeUpdateQueryV1;
  }
}
