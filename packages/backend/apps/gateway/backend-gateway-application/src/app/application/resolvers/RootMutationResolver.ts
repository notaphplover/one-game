import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { CreateAuthMutationResolver } from '../../../auth/application/resolvers/CreateAuthMutationResolver';

@Injectable()
export class RootMutationResolver
  implements
    graphqlModels.RootMutationResolvers<Request, graphqlModels.RootMutation>
{
  readonly #createAuthMutation: graphqlModels.CreateAuthMutationResolvers<Request>;

  constructor(
    @Inject(CreateAuthMutationResolver)
    createAuthMutationResolver: graphqlModels.CreateAuthMutationResolvers<Request>,
  ) {
    this.#createAuthMutation = createAuthMutationResolver;
  }

  public async createAuthByCode(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.CreateAuthMutationCreateAuthByCodeArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Auth> {
    return this.#getResolverFunction(
      this.#createAuthMutation,
      this.#createAuthMutation.createAuthByCode,
    )(parent, args, request, info);
  }

  public async createAuthByCredentials(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.CreateAuthMutationCreateAuthByCredentialsArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Auth> {
    return this.#getResolverFunction(
      this.#createAuthMutation,
      this.#createAuthMutation.createAuthByCredentials,
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
