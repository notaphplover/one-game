import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { RootMutationResolver } from './RootMutationResolver';

@Injectable()
export class ApplicationResolver implements Partial<graphqlModels.Resolvers> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly RootMutation: graphqlModels.RootMutationResolvers<Request>;

  constructor(
    @Inject(RootMutationResolver)
    rootMutation: graphqlModels.RootMutationResolvers<Request>,
  ) {
    this.RootMutation = rootMutation;
  }
}
