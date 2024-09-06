import { models as apiModels } from '@cornie-js/api-models';

export interface GameWithSpecPair {
  game: apiModels.GameV1;
  spec: apiModels.GameSpecV1;
}
