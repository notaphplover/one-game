import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameSpecGraphqlFromGameSpecV1Builder
  implements Builder<graphqlModels.GameSpec, [apiModels.GameSpecV1]>
{
  public build(gameSpecV1: apiModels.GameSpecV1): graphqlModels.GameSpec {
    return {
      cardSpecs: gameSpecV1.cardSpecs,
      gameSlotsAmount: gameSpecV1.gameSlotsAmount,
      options: gameSpecV1.options,
    };
  }
}
