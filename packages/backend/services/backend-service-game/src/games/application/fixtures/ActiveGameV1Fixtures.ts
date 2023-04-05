import { models as apiModels } from '@one-game-js/api-models';

import { CardV1Fixtures } from '../../../cards/application/fixtures/CardV1Fixtures';
import { GameSpecV1Fixtures } from '../../../cards/application/fixtures/GameSpecV1Fixtures';

export class ActiveGameV1Fixtures {
  public static get any(): apiModels.ActiveGameV1 {
    return {
      currentCard: CardV1Fixtures.any,
      currentColor: 'blue',
      currentDirection: 'antiClockwise',
      currentPlayingSlotIndex: 0,
      gameSlotsAmount: 1,
      gameSpec: GameSpecV1Fixtures.any,
      id: '6fbcdb6c-b03c-4754-94c1-9f664f036cde',
    };
  }
}
