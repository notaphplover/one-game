import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { ActiveGameSlot } from '../models/ActiveGameSlot';

export class ActiveGameSlotFixtures {
  public static get any(): ActiveGameSlot {
    return {
      cards: [CardFixtures.any],
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }
}
