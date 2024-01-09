import { models as apiModels } from '@cornie-js/api-models';

import { NonStartedGameSlotV1Fixtures } from './NonStartedGameSlotV1Fixtures';

export class NonStartedGameV1Fixtures {
  public static get any(): apiModels.NonStartedGameV1 {
    const fixture: apiModels.NonStartedGameV1 = {
      id: '6fbcdb6c-b03c-4754-94c1-9f664f036cde',
      state: {
        slots: [NonStartedGameSlotV1Fixtures.any],
        status: 'nonStarted',
      },
    };

    return fixture;
  }
}
