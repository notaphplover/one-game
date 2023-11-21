import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { AuthMutationResolver } from '../../../auth/application/resolvers/AuthMutationResolver';
import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { GameMutationResolver } from '../../../games/application/resolvers/GameMutationResolver';
import { UserMutationResolver } from '../../../users/application/resolvers/UserMutationResolver';

@Injectable()
export class RootMutationResolver
  implements
    graphqlModels.RootMutationResolvers<Request, graphqlModels.RootMutation>
{
  readonly #authMutationResolver: CanonicalResolver<
    graphqlModels.AuthMutationResolvers<Request>
  >;
  readonly #gameMutationResolver: CanonicalResolver<
    graphqlModels.GameMutationResolvers<Request>
  >;
  readonly #userMutationResolver: CanonicalResolver<
    graphqlModels.UserMutationResolvers<Request>
  >;

  constructor(
    @Inject(AuthMutationResolver)
    authMutationResolver: CanonicalResolver<
      graphqlModels.AuthMutationResolvers<Request>
    >,
    @Inject(GameMutationResolver)
    gameMutationResolver: CanonicalResolver<
      graphqlModels.GameMutationResolvers<Request>
    >,
    @Inject(UserMutationResolver)
    userMutationResolver: CanonicalResolver<
      graphqlModels.UserMutationResolvers<Request>
    >,
  ) {
    this.#authMutationResolver = authMutationResolver;
    this.#gameMutationResolver = gameMutationResolver;
    this.#userMutationResolver = userMutationResolver;
  }

  public async createAuthByCode(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.AuthMutationCreateAuthByCodeArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Auth> {
    return this.#authMutationResolver.createAuthByCode(
      parent,
      args,
      request,
      info,
    );
  }

  public async createAuthByCredentials(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.AuthMutationCreateAuthByCredentialsArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Auth> {
    return this.#authMutationResolver.createAuthByCredentials(
      parent,
      args,
      request,
      info,
    );
  }

  public async createGame(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.GameMutationCreateGameArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Game> {
    return this.#gameMutationResolver.createGame(parent, args, request, info);
  }

  public async createUser(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.UserMutationCreateUserArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.User> {
    return this.#userMutationResolver.createUser(parent, args, request, info);
  }

  public async passGameTurn(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.GameMutationPassGameTurnArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Game | null> {
    return this.#gameMutationResolver.passGameTurn(parent, args, request, info);
  }

  public async playGameCards(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.GameMutationPlayGameCardsArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.Game | null> {
    return this.#gameMutationResolver.playGameCards(
      parent,
      args,
      request,
      info,
    );
  }

  public async updateUserMe(
    parent: graphqlModels.RootMutation,
    args: graphqlModels.UserMutationUpdateUserMeArgs,
    request: Request,
    info: GraphQLResolveInfo,
  ): Promise<graphqlModels.User> {
    return this.#userMutationResolver.updateUserMe(parent, args, request, info);
  }
}
