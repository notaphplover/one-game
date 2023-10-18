import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { RootMutationResolver } from './RootMutationResolver';
import { RootQueryResolver } from './RootQueryResolver';

@Injectable()
export class ApplicationResolver implements Partial<graphqlModels.Resolvers> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly RootMutation: graphqlModels.RootMutationResolvers<Request>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly RootQuery: graphqlModels.RootQueryResolvers<Request>;

  constructor(
    @Inject(RootMutationResolver)
    rootMutationResolver: graphqlModels.RootMutationResolvers<Request>,
    @Inject(RootQueryResolver)
    rootQueryResolver: graphqlModels.RootQueryResolvers<Request>,
  ) {
    this.RootMutation = rootMutationResolver;
    this.RootQuery = rootQueryResolver;
  }
}
