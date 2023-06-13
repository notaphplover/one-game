import { ActiveGameSlot } from '@cornie-js/backend-app-game-domain/games/domain';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';

export class ActiveGameSlotFixtures {
  public static get any(): ActiveGameSlot {
    return {
      cards: [CardFixtures.any],
      position: 0,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }

  public static get withPositionZero(): ActiveGameSlot {
    return {
      ...ActiveGameSlotFixtures.any,
      position: 0,
    };
  }
}
