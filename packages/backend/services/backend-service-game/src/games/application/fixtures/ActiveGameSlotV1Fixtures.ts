import { models as apiModels } from '@one-game-js/api-models';

export class ActiveGameSlotV1Fixtures {
  public static get any(): apiModels.ActiveGameSlotV1 {
    const fixture: apiModels.ActiveGameSlotV1 = {
      cardsAmount: 1,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };

    return fixture;
  }
}
