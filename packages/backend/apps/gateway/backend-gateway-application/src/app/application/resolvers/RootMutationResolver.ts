import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { AuthMutationResolver } from '../../../auth/application/resolvers/AuthMutationResolver';
import { UserMutationResolver } from '../../../users/application/resolvers/UserMutationResolver';

@Injectable()
export class RootMutationResolver
  implements
    graphqlModels.RootMutationResolvers<Request, graphqlModels.RootMutation>
{
  readonly #authMutation: graphqlModels.AuthMutationResolvers<Request>;
  readonly #userMutation: graphqlModels.UserMutationResolvers<Request>;

  constructor(
    @Inject(AuthMutationResolver)
    authMutationResolver: graphqlModels.AuthMutationResolvers<Request>,
    @Inject(UserMutationResolver)
    userMutationResolver: graphqlModels.UserMutationResolvers<Request>,
  ) {
    this.#authMutation = authMutationResolver;
    this.#userMutation = userMutationResolver;
  }

  public async createAuthByCode(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.AuthMutationCreateAuthByCodeArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Auth> {
    return this.#getResolverFunction(
      this.#authMutation,
      this.#authMutation.createAuthByCode,
    )(parent, args, request, info);
  }

  public async createAuthByCredentials(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.AuthMutationCreateAuthByCredentialsArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Auth> {
    return this.#getResolverFunction(
      this.#authMutation,
      this.#authMutation.createAuthByCredentials,
    )(parent, args, request, info);
  }

  public async createUser(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.UserMutationCreateUserArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.User> {
    return this.#getResolverFunction(
      this.#userMutation,
      this.#userMutation.createUser,
    )(parent, args, request, info);
  }

  public async updateUserMe(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.UserMutationUpdateUserMeArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.User> {
    return this.#getResolverFunction(
      this.#userMutation,
      this.#userMutation.updateUserMe,
    )(parent, args, request, info);
  }

  #getResolverFunction<TResult, TArgs>(
    self: unknown,
    resolver: graphqlModels.Resolver<
      TResult,
      graphqlModels.RootMutation,
      Request,
      TArgs
    >,
  ): graphqlModels.ResolverFn<
    TResult,
    graphqlModels.RootMutation,
    Request,
    TArgs
  > {
    if (typeof resolver === 'function') {
      return resolver.bind(self);
    } else {
      return resolver.resolve.bind(self);
    }
  }
}
