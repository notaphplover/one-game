import { models as apiModels } from '@cornie-js/api-models';

import { GameSpecV1Fixtures } from '../../../cards/application/fixtures/GameSpecV1Fixtures';
import { NonStartedGameSlotV1Fixtures } from './NonStartedGameSlotV1Fixtures';

export class NonStartedGameV1Fixtures {
  public static get any(): apiModels.NonStartedGameV1 {
    const fixture: apiModels.NonStartedGameV1 = {
      gameSlotsAmount: 1,
      gameSpec: GameSpecV1Fixtures.any,
      id: '6fbcdb6c-b03c-4754-94c1-9f664f036cde',
      slots: [NonStartedGameSlotV1Fixtures.any],
    };

    return fixture;
  }
}
