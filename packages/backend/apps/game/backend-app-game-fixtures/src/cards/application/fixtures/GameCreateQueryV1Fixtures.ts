import { models as apiModels } from '@cornie-js/api-models';

import { GameSpecV1Fixtures } from './GameSpecV1Fixtures';

export class GameCreateQueryV1Fixtures {
  public static get any(): apiModels.GameCreateQueryV1 {
    return {
      gameSlotsAmount: 3,
      gameSpec: GameSpecV1Fixtures.any,
    };
  }
}
