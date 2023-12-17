import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';
import { GameQueryResolver } from '../../../games/application/resolvers/GameQueryResolver';
import { UserQueryResolver } from '../../../users/application/resolvers/UserQueryResolver';

type ResolverFnReturnType<TResult, TArgs> = ReturnType<
  graphqlModels.ResolverFn<TResult, graphqlModels.RootQuery, Context, TArgs>
>;

@Injectable()
export class RootQueryResolver
  implements graphqlModels.RootQueryResolvers<Context, graphqlModels.RootQuery>
{
  readonly #gameQueryResolver: CanonicalResolver<
    graphqlModels.GameQueryResolvers<Context>
  >;
  readonly #userQueryResolver: CanonicalResolver<
    graphqlModels.UserQueryResolvers<Context>
  >;

  constructor(
    @Inject(GameQueryResolver)
    gameQueryResolver: CanonicalResolver<
      graphqlModels.GameQueryResolvers<Context>
    >,
    @Inject(UserQueryResolver)
    userQueryResolver: CanonicalResolver<
      graphqlModels.UserQueryResolvers<Context>
    >,
  ) {
    this.#gameQueryResolver = gameQueryResolver;
    this.#userQueryResolver = userQueryResolver;
  }

  public async gameById(
    parent: graphqlModels.RootQuery,
    args: graphqlModels.GameQueryGameByIdArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.Game | null>> {
    return this.#gameQueryResolver.gameById(parent, args, context, info);
  }

  public myGames(
    parent: graphqlModels.RootQuery,
    args: Partial<graphqlModels.RootQueryMyGamesArgs>,
    context: Context,
    info: GraphQLResolveInfo,
  ): ResolverFnReturnType<
    Array<graphqlModels.ResolversTypes['Game']>,
    Partial<graphqlModels.RootQueryMyGamesArgs>
  > {
    return this.#gameQueryResolver.myGames(parent, args, context, info);
  }

  public async userById(
    parent: graphqlModels.RootQuery,
    args: graphqlModels.UserQueryUserByIdArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.User> | null> {
    return this.#userQueryResolver.userById(parent, args, context, info);
  }

  public async userMe(
    parent: graphqlModels.RootQuery,
    args: Record<string, unknown>,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.User>> {
    return this.#userQueryResolver.userMe(parent, args, context, info);
  }
}
