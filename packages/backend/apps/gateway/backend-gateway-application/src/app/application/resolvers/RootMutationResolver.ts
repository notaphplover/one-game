import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { AuthMutationResolver } from '../../../auth/application/resolvers/AuthMutationResolver';
import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';
import { GameMutationResolver } from '../../../games/application/resolvers/GameMutationResolver';
import { UserMutationResolver } from '../../../users/application/resolvers/UserMutationResolver';

@Injectable()
export class RootMutationResolver
  implements
    graphqlModels.RootMutationResolvers<Context, graphqlModels.RootMutation>
{
  readonly #authMutationResolver: CanonicalResolver<
    graphqlModels.AuthMutationResolvers<Context>
  >;
  readonly #gameMutationResolver: CanonicalResolver<
    graphqlModels.GameMutationResolvers<Context>
  >;
  readonly #userMutationResolver: CanonicalResolver<
    graphqlModels.UserMutationResolvers<Context>
  >;

  constructor(
    @Inject(AuthMutationResolver)
    authMutationResolver: CanonicalResolver<
      graphqlModels.AuthMutationResolvers<Context>
    >,
    @Inject(GameMutationResolver)
    gameMutationResolver: CanonicalResolver<
      graphqlModels.GameMutationResolvers<Context>
    >,
    @Inject(UserMutationResolver)
    userMutationResolver: CanonicalResolver<
      graphqlModels.UserMutationResolvers<Context>
    >,
  ) {
    this.#authMutationResolver = authMutationResolver;
    this.#gameMutationResolver = gameMutationResolver;
    this.#userMutationResolver = userMutationResolver;
  }

  public async createAuthByCode(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.AuthMutationCreateAuthByCodeArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.Auth>> {
    return this.#authMutationResolver.createAuthByCode(
      parent,
      args,
      context,
      info,
    );
  }

  public async createAuthByCredentials(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.AuthMutationCreateAuthByCredentialsArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.Auth>> {
    return this.#authMutationResolver.createAuthByCredentials(
      parent,
      args,
      context,
      info,
    );
  }

  public async createGame(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.GameMutationCreateGameArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.NonStartedGame>> {
    return this.#gameMutationResolver.createGame(parent, args, context, info);
  }

  public async createGameSlot(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.GameMutationCreateGameSlotArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.NonStartedGameSlot>> {
    return this.#gameMutationResolver.createGameSlot(
      parent,
      args,
      context,
      info,
    );
  }

  public async createUser(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.UserMutationCreateUserArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.User>> {
    return this.#userMutationResolver.createUser(parent, args, context, info);
  }

  public async deleteUserMe(
    parent: graphqlModels.RootMutation,
    _args: Record<string, unknown>,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<unknown> | null> {
    return this.#userMutationResolver.deleteUserMe(
      parent,
      _args,
      context,
      info,
    );
  }

  public async passGameTurn(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.GameMutationPassGameTurnArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.Game> | null> {
    return this.#gameMutationResolver.passGameTurn(parent, args, context, info);
  }

  public async playGameCards(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.GameMutationPlayGameCardsArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.Game> | null> {
    return this.#gameMutationResolver.playGameCards(
      parent,
      args,
      context,
      info,
    );
  }

  public async updateUserMe(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.UserMutationUpdateUserMeArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<Partial<graphqlModels.User>> {
    return this.#userMutationResolver.updateUserMe(parent, args, context, info);
  }
}
