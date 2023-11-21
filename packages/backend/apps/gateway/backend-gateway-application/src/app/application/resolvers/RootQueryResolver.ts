import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { GameQueryResolver } from '../../../games/application/resolvers/GameQueryResolver';
import { UserQueryResolver } from '../../../users/application/resolvers/UserQueryResolver';

type ResolverFnReturnType<TResult, TArgs> = ReturnType<
  graphqlModels.ResolverFn<TResult, graphqlModels.RootQuery, Request, TArgs>
>;

@Injectable()
export class RootQueryResolver
  implements graphqlModels.RootQueryResolvers<Request, graphqlModels.RootQuery>
{
  readonly #gameQueryResolver: graphqlModels.GameQueryResolvers<Request>;
  readonly #userQueryResolver: graphqlModels.UserQueryResolvers<Request>;

  constructor(
    @Inject(GameQueryResolver)
    gameQueryResolver: graphqlModels.GameQueryResolvers<Request>,
    @Inject(UserQueryResolver)
    userQueryResolver: graphqlModels.UserQueryResolvers<Request>,
  ) {
    this.#gameQueryResolver = gameQueryResolver;
    this.#userQueryResolver = userQueryResolver;
  }

  public async gameById(
    parent: graphqlModels.RootQuery,
    args: graphqlModels.GameQueryGameByIdArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Game | null> {
    return this.#getResolverFunction(
      this.#gameQueryResolver,
      this.#gameQueryResolver.gameById,
    )(parent, args, request, info);
  }

  public myGames(
    parent: graphqlModels.RootQuery,
    args: Partial<graphqlModels.RootQueryMyGamesArgs>,
    request: Request,
    info: GraphQLResolveInfo,
  ): ResolverFnReturnType<
    Array<graphqlModels.ResolversTypes['Game']>,
    Partial<graphqlModels.RootQueryMyGamesArgs>
  > {
    return this.#getResolverFunction(
      this.#gameQueryResolver,
      this.#gameQueryResolver.myGames,
    )(parent, args, request, info);
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

  public async userMe(
    parent: graphqlModels.RootQuery,
    args: Record<string, unknown>,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.User> {
    return this.#getResolverFunction(
      this.#userQueryResolver,
      this.#userQueryResolver.userMe,
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
