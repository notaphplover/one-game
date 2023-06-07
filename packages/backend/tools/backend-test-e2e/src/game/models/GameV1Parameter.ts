import { models as apiModels } from '@cornie-js/api-models';

export interface GameV1Parameter {
  game: apiModels.GameV1;
  gameCreateQuery: apiModels.GameCreateQueryV1;
}
