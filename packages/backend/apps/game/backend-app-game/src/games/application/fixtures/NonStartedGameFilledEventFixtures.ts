import { NonStartedGameFilledEvent } from '../../domain/events/NonStartedGameFilledEvent';

export class NonStartedGameFilledEventFixtures {
  public static get any(): NonStartedGameFilledEvent {
    return {
      gameId: '6fbcdb6c-b03c-4754-94c1-9f664f036cde',
    };
  }
}
