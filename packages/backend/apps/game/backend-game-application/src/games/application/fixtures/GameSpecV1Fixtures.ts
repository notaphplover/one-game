import { models as apiModels } from '@cornie-js/api-models';

import { GameCardSpecV1Fixtures } from './GameCardSpecV1Fixtures';

export class GameSpecV1Fixtures {
  public static get any(): apiModels.GameSpecV1 {
    return {
      cardSpecs: [GameCardSpecV1Fixtures.any],
      gameSlotsAmount: 1,
    };
  }

  public static get withCardSpecsOne(): apiModels.GameSpecV1 {
    return {
      ...GameSpecV1Fixtures.any,
      cardSpecs: [GameCardSpecV1Fixtures.any],
    };
  }
}
