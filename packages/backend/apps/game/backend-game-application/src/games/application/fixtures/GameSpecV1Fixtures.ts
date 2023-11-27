import { models as apiModels } from '@cornie-js/api-models';

import { GameCardSpecV1Fixtures } from './GameCardSpecV1Fixtures';
import { GameOptionsV1Fixtures } from './GameOptionsV1Fixtures';

export class GameSpecV1Fixtures {
  public static get any(): apiModels.GameSpecV1 {
    return {
      cardSpecs: [GameCardSpecV1Fixtures.any],
      gameSlotsAmount: 1,
      options: GameOptionsV1Fixtures.any,
    };
  }

  public static get withCardSpecsOne(): apiModels.GameSpecV1 {
    return {
      ...GameSpecV1Fixtures.any,
      cardSpecs: [GameCardSpecV1Fixtures.any],
    };
  }
}
