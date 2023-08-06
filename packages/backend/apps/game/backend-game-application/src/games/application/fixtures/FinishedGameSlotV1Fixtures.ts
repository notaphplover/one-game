import { models as apiModels } from '@cornie-js/api-models';

export class FinishedGameSlotV1Fixtures {
  public static get any(): apiModels.FinishedGameSlotV1 {
    const fixture: apiModels.FinishedGameSlotV1 = {
      cardsAmount: 1,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };

    return fixture;
  }
}
