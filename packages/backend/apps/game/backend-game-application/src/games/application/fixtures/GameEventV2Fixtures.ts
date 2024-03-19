import { models as apiModels } from '@cornie-js/api-models';

export class GameEventV2Fixtures {
  public static get any(): apiModels.GameEventV2 {
    const gameEvent: apiModels.GameEventV2 = {
      currentPlayingSlotIndex: 0,
      kind: 'turnPassed',
      nextPlayingSlotIndex: 1,
      position: 1,
    };

    return gameEvent;
  }
}
