import { models as apiModels } from '@cornie-js/api-models';

export class GameIdPassTurnQueryV1Fixtures {
  public static get any(): apiModels.GameIdPassTurnQueryV1 {
    return {
      kind: 'passTurn',
      slotIndex: 0,
    };
  }

  public static get withSlotIndexZero(): apiModels.GameIdPassTurnQueryV1 {
    return {
      kind: 'passTurn',
      slotIndex: 0,
    };
  }

  public static get withUnexistingSlotIndex(): apiModels.GameIdPassTurnQueryV1 {
    return {
      kind: 'passTurn',
      slotIndex: -1,
    };
  }
}
