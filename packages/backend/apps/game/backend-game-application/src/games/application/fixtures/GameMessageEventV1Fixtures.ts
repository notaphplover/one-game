import { models as apiModels } from '@cornie-js/api-models';

import { NonStartedGameV1Fixtures } from '.';

export class GameMessageEventV1Fixtures {
  public static get any(): apiModels.GameMessageEventV1 {
    return {
      game: NonStartedGameV1Fixtures.any,
      kind: 'game-updated',
    };
  }
}
