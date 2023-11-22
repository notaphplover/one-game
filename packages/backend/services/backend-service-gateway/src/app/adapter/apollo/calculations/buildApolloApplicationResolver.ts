import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Builder } from '@cornie-js/backend-common';
import { ApplicationResolver } from '@cornie-js/backend-gateway-application';
import { Request } from '@cornie-js/backend-http';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

export function buildApolloApplicationResolver(
  applicationResolver: ApplicationResolver,
  graphQlErrorFromErrorBuilder: Builder<GraphQLError, [unknown]>,
): ApplicationResolver {
  return {
    Game: applicationResolver.Game,
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
  };
}

function getResolverFunction<TParent, TResult, TArgs>(
  self: unknown,
  resolver: graphqlModels.Resolver<TResult, TParent, Request, TArgs>,
): graphqlModels.ResolverFn<TResult, TParent, Request, TArgs> {
  if (typeof resolver === 'function') {
    return resolver.bind(self);
  } else {
    return resolver.resolve.bind(self);
  }
}

function buildApolloResolver<TParent, TResult, TArgs>(
  self: unknown,
  graphQlErrorFromErrorBuilder: Builder<GraphQLError, [unknown]>,
  resolver: graphqlModels.Resolver<TResult, TParent, Request, TArgs>,
): graphqlModels.ResolverFn<TResult, TParent, Request, TArgs> {
  return async (
    parent: TParent,
    args: TArgs,
    context: Request,
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
