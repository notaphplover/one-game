import { models as apiModels } from '@cornie-js/api-models';

export class GameCreateQueryV1Fixtures {
  public static get any(): apiModels.GameCreateQueryV1 {
    return {
      gameSlotsAmount: 3,
    };
  }
}
