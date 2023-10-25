import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { UserQueryResolver } from '../../../users/application/resolvers/UserQueryResolver';

@Injectable()
export class RootQueryResolver
  implements graphqlModels.RootQueryResolvers<Request, graphqlModels.RootQuery>
{
  readonly #userQueryResolver: graphqlModels.UserQueryResolvers<Request>;

  constructor(
    @Inject(UserQueryResolver)
    userQueryResolver: graphqlModels.UserQueryResolvers<Request>,
  ) {
    this.#userQueryResolver = userQueryResolver;
  }

  public async userById(
    parent: graphqlModels.RootQuery,
    args: graphqlModels.UserQueryUserByIdArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.User | null> {
    return this.#getResolverFunction(
      this.#userQueryResolver,
      this.#userQueryResolver.userById,
    )(parent, args, request, info);
  }

  #getResolverFunction<TResult, TArgs>(
    self: unknown,
    resolver: graphqlModels.Resolver<
      TResult,
      graphqlModels.RootQuery,
      Request,
      TArgs
    >,
  ): graphqlModels.ResolverFn<
    TResult,
    graphqlModels.RootQuery,
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
