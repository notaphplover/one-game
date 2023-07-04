import { models as apiModels } from '@cornie-js/api-models';

import { GameSpecV1Fixtures } from './GameSpecV1Fixtures';
import { NonStartedGameSlotV1Fixtures } from './NonStartedGameSlotV1Fixtures';

export class NonStartedGameV1Fixtures {
  public static get any(): apiModels.NonStartedGameV1 {
    const fixture: apiModels.NonStartedGameV1 = {
      id: '6fbcdb6c-b03c-4754-94c1-9f664f036cde',
      spec: GameSpecV1Fixtures.any,
      state: {
        slots: [NonStartedGameSlotV1Fixtures.any],
        status: 'nonStarted',
      },
    };

    return fixture;
  }
}
