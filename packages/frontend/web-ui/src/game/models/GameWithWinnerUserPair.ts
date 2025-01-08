import { models as apiModels } from '@cornie-js/api-models';

export interface GameWithWinnerUserPair {
  game: apiModels.GameV1;
  winnerUser: apiModels.UserV1 | null;
}
