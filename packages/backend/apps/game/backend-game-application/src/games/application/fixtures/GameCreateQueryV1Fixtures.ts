import { models as apiModels } from '@cornie-js/api-models';

import { GameOptionsV1Fixtures } from './GameOptionsV1Fixtures';

export class GameCreateQueryV1Fixtures {
  public static get any(): apiModels.GameCreateQueryV1 {
    return {
      gameSlotsAmount: 3,
      options: GameOptionsV1Fixtures.any,
    };
  }
}
