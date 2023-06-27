import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { ActiveGameSlot } from '../models/ActiveGameSlot';

export class ActiveGameSlotFixtures {
  public static get any(): ActiveGameSlot {
    return {
      cards: [CardFixtures.any],
      position: 0,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }

  public static get withPositionOne(): ActiveGameSlot {
    return {
      ...ActiveGameSlotFixtures.any,
      position: 1,
    };
  }

  public static get withPositionZero(): ActiveGameSlot {
    return {
      ...ActiveGameSlotFixtures.any,
      position: 0,
    };
  }
}
