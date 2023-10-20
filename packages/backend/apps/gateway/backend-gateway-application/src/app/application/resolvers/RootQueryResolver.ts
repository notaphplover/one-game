import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { FindUsersQueryResolver } from '../../../users/application/resolvers/FindUsersQueryResolver';

@Injectable()
export class RootQueryResolver
  implements graphqlModels.RootQueryResolvers<Request, graphqlModels.RootQuery>
{
  readonly #findUsersQueryResolver: graphqlModels.FindUsersQueryResolvers<Request>;

  constructor(
    @Inject(FindUsersQueryResolver)
    findUsersQueryResolver: graphqlModels.FindUsersQueryResolvers<Request>,
  ) {
    this.#findUsersQueryResolver = findUsersQueryResolver;
  }

  public async userById(
    parent: graphqlModels.RootQuery,
    args: graphqlModels.FindUsersQueryUserByIdArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.User | null> {
    return this.#getResolverFunction(
      this.#findUsersQueryResolver,
      this.#findUsersQueryResolver.userById,
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
