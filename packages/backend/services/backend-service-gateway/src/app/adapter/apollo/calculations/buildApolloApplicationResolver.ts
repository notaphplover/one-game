import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Builder } from '@cornie-js/backend-common';
import {
  ApplicationResolver,
  Context,
} from '@cornie-js/backend-gateway-application';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

export function buildApolloApplicationResolver(
  applicationResolver: ApplicationResolver,
  graphQlErrorFromErrorBuilder: Builder<GraphQLError, [unknown]>,
): ApplicationResolver {
  return {
    ActiveGame: applicationResolver.ActiveGame,
    FinishedGame: applicationResolver.FinishedGame,
    Game: applicationResolver.Game,
    NonStartedGame: applicationResolver.NonStartedGame,
    RootMutation: {
      createAuthByCode: buildApolloResolver(
        applicationResolver.RootMutation,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootMutation.createAuthByCode,
      ),
      createAuthByCredentials: buildApolloResolver(
        applicationResolver.RootMutation,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootMutation.createAuthByCredentials,
      ),
      createGame: buildApolloResolver(
        applicationResolver.RootMutation,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootMutation.createGame,
      ),
      createUser: buildApolloResolver(
        applicationResolver.RootMutation,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootMutation.createUser,
      ),
      deleteUserMe: buildApolloResolver(
        applicationResolver.RootMutation,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootMutation.deleteUserMe,
      ),
      passGameTurn: buildApolloResolver(
        applicationResolver.RootMutation,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootMutation.passGameTurn,
      ),
      playGameCards: buildApolloResolver(
        applicationResolver.RootMutation,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootMutation.playGameCards,
      ),
      updateUserMe: buildApolloResolver(
        applicationResolver.RootMutation,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootMutation.updateUserMe,
      ),
    },
    RootQuery: {
      gameById: buildApolloResolver(
        applicationResolver.RootQuery,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootQuery.gameById,
      ),
      myGames: buildApolloResolver(
        applicationResolver.RootQuery,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootQuery.myGames,
      ),
      userById: buildApolloResolver(
        applicationResolver.RootQuery,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootQuery.userById,
      ),
      userMe: buildApolloResolver(
        applicationResolver.RootQuery,
        graphQlErrorFromErrorBuilder,
        applicationResolver.RootQuery.userMe,
      ),
    },
    Void: applicationResolver.Void,
  };
}

function getResolverFunction<TParent, TResult, TArgs>(
  self: unknown,
  resolver: graphqlModels.Resolver<TResult, TParent, Context, TArgs>,
): graphqlModels.ResolverFn<TResult, TParent, Context, TArgs> {
  if (typeof resolver === 'function') {
    return resolver.bind(self);
  } else {
    return resolver.resolve.bind(self);
  }
}

function buildApolloResolver<TParent, TResult, TArgs>(
  self: unknown,
  graphQlErrorFromErrorBuilder: Builder<GraphQLError, [unknown]>,
  resolver: graphqlModels.Resolver<TResult, TParent, Context, TArgs>,
): graphqlModels.ResolverFn<TResult, TParent, Context, TArgs> {
  return async (
    parent: TParent,
    args: TArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ): Promise<TResult> => {
    try {
      return await getResolverFunction(self, resolver)(
        parent,
        args,
        context,
        info,
      );
    } catch (error: unknown) {
      throw graphQlErrorFromErrorBuilder.build(error);
    }
  };
}
