import { models as apiModels } from '@one-game-js/api-models';

export interface UserV1RequestContext extends Record<string | symbol, unknown> {
  user: apiModels.UserV1;
}
