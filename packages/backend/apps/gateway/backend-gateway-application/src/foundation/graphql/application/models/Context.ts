import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

export interface Context {
  request: Request;

  gameSpecByGameIdHandler: Handler<
    [string],
    graphqlModels.GameSpec | undefined
  >;
}
