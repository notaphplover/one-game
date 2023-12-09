import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Inject, Injectable } from '@nestjs/common';

import { Context } from '../../../foundation/graphql/application/models/Context';
import { GameResolver } from '../../../games/application/resolvers/GameResolver';
import { RootMutationResolver } from './RootMutationResolver';
import { RootQueryResolver } from './RootQueryResolver';

@Injectable()
export class ApplicationResolver implements Partial<graphqlModels.Resolvers> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly Game: graphqlModels.GameResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly RootMutation: graphqlModels.RootMutationResolvers<Context>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly RootQuery: graphqlModels.RootQueryResolvers<Context>;

  constructor(
    @Inject(GameResolver)
    gameResolver: graphqlModels.GameResolvers<Context>,
    @Inject(RootMutationResolver)
    rootMutationResolver: graphqlModels.RootMutationResolvers<Context>,
    @Inject(RootQueryResolver)
    rootQueryResolver: graphqlModels.RootQueryResolvers<Context>,
  ) {
    this.Game = gameResolver;
    this.RootMutation = rootMutationResolver;
    this.RootQuery = rootQueryResolver;
  }
}
