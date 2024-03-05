import { models as apiModels } from '@cornie-js/api-models';

export class GameIdDrawCardsQueryV1Fixtures {
  public static get any(): apiModels.GameIdDrawCardsQueryV1 {
    return {
      kind: 'drawCards',
      slotIndex: 0,
    };
  }
}
