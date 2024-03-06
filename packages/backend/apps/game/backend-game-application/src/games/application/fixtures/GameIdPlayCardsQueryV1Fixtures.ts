import { models as apiModels } from '@cornie-js/api-models';

export class GameIdPlayCardsQueryV1Fixtures {
  public static get any(): apiModels.GameIdPlayCardsQueryV1 {
    return {
      cardIndexes: [],
      kind: 'playCards',
      slotIndex: 0,
    };
  }

  public static get withColorChoice(): apiModels.GameIdPlayCardsQueryV1 {
    return {
      ...GameIdPlayCardsQueryV1Fixtures.any,
      colorChoice: 'green',
    };
  }

  public static get withColorChoiceAndSlotIndexZero(): apiModels.GameIdPlayCardsQueryV1 {
    const fixture: apiModels.GameIdPlayCardsQueryV1 = {
      ...GameIdPlayCardsQueryV1Fixtures.any,
      colorChoice: 'green',
      slotIndex: 0,
    };

    return fixture;
  }

  public static get withNoColorChoiceAndSlotIndexZero(): apiModels.GameIdPlayCardsQueryV1 {
    const fixture: apiModels.GameIdPlayCardsQueryV1 = {
      ...GameIdPlayCardsQueryV1Fixtures.any,
      slotIndex: 0,
    };

    delete fixture.colorChoice;

    return fixture;
  }

  public static get withSlotIndexZero(): apiModels.GameIdPlayCardsQueryV1 {
    return {
      ...GameIdPlayCardsQueryV1Fixtures.any,
      slotIndex: 0,
    };
  }
}
