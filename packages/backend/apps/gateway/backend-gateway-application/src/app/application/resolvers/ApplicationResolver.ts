import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Inject, Injectable } from '@nestjs/common';
import { GraphQLScalarType } from 'graphql';
import { GraphQLVoid } from 'graphql-scalars';

import { Context } from '../../../foundation/graphql/application/models/Context';
import { ActiveGameResolver } from '../../../games/application/resolvers/ActiveGameResolver';
import { FinishedGameResolver } from '../../../games/application/resolvers/FinishedGameResolver';
import { GameResolver } from '../../../games/application/resolvers/GameResolver';
import { NonStartedGameResolver } from '../../../games/application/resolvers/NonStartedGameResolver';
import { RootMutationResolver } from './RootMutationResolver';
import { RootQueryResolver } from './RootQueryResolver';

@Injectable()
export class ApplicationResolver implements Partial<graphqlModels.Resolvers> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly ActiveGame: graphqlModels.ActiveGameResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly FinishedGame: graphqlModels.FinishedGameResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly Game: graphqlModels.GameResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly NonStartedGame: graphqlModels.NonStartedGameResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly RootMutation: graphqlModels.RootMutationResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly RootQuery: graphqlModels.RootQueryResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly Void: GraphQLScalarType;

  constructor(
    @Inject(ActiveGameResolver)
    activeGameResolverResolver: graphqlModels.ActiveGameResolvers<Context>,
    @Inject(FinishedGameResolver)
    finishedGameResolverResolver: graphqlModels.FinishedGameResolvers<Context>,
    @Inject(GameResolver)
    gameResolver: graphqlModels.GameResolvers<Context>,
    @Inject(NonStartedGameResolver)
    nonStartedGameResolverResolver: graphqlModels.NonStartedGameResolvers<Context>,
    @Inject(RootMutationResolver)
    rootMutationResolver: graphqlModels.RootMutationResolvers<Context>,
    @Inject(RootQueryResolver)
    rootQueryResolver: graphqlModels.RootQueryResolvers<Context>,
  ) {
    this.ActiveGame = activeGameResolverResolver;
    this.FinishedGame = finishedGameResolverResolver;
    this.Game = gameResolver;
    this.NonStartedGame = nonStartedGameResolverResolver;
    this.RootMutation = rootMutationResolver;
    this.RootQuery = rootQueryResolver;
    this.Void = GraphQLVoid;
  }
}
