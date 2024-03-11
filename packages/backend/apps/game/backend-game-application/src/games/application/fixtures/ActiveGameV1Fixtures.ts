import { models as apiModels } from '@cornie-js/api-models';

import { CardV1Fixtures } from '../../../cards/application/fixtures/CardV1Fixtures';
import { ActiveGameSlotV1Fixtures } from './ActiveGameSlotV1Fixtures';

export class ActiveGameV1Fixtures {
  public static get any(): apiModels.ActiveGameV1 {
    return {
      id: '6fbcdb6c-b03c-4754-94c1-9f664f036cde',
      state: {
        currentCard: CardV1Fixtures.any,
        currentColor: 'blue',
        currentDirection: 'antiClockwise',
        currentPlayingSlotIndex: 0,
        currentTurnCardsDrawn: false,
        currentTurnCardsPlayed: false,
        drawCount: 0,
        slots: [ActiveGameSlotV1Fixtures.any],
        status: 'active',
      },
    };
  }
}
