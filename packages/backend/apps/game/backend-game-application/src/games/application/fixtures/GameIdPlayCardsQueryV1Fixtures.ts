import { models as apiModels } from '@cornie-js/api-models';

export class GameIdPlayCardsQueryV1Fixtures {
  public static get any(): apiModels.GameIdPlayCardsQueryV1 {
    return {
      cardIndexes: [],
      kind: 'playCards',
      slotIndex: 0,
    };
  }

  public static get withSlotIndexZero(): apiModels.GameIdPlayCardsQueryV1 {
    return {
      ...GameIdPlayCardsQueryV1Fixtures.any,
      slotIndex: 0,
    };
  }
}
