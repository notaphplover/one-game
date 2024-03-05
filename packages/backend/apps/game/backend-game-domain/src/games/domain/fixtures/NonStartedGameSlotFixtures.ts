import { NonStartedGameSlot } from '../valueObjects/NonStartedGameSlot';

export class NonStartedGameSlotFixtures {
  public static get any(): NonStartedGameSlot {
    return {
      position: 0,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };
  }

  public static get withPositionZero(): NonStartedGameSlot {
    return {
      ...NonStartedGameSlotFixtures.any,
      position: 1,
    };
  }
}
