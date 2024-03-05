import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { FinishedGameSlot } from '../valueObjects/FinishedGameSlot';

export class FinishedGameSlotFixtures {
  public static get any(): FinishedGameSlot {
    return {
      cards: [CardFixtures.any],
      position: 0,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }

  public static get withPositionZero(): FinishedGameSlot {
    return {
      ...FinishedGameSlotFixtures.any,
      position: 1,
    };
  }
}
