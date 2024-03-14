import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';

export class GameDrawMutationFixtures {
  public static get any(): GameDrawMutation {
    return {
      cards: [CardFixtures.any, CardFixtures.any],
      deck: [GameCardSpecFixtures.any],
      isDiscardPileEmptied: false,
    };
  }

  public static get withCardsOne(): GameDrawMutation {
    return {
      ...GameDrawMutationFixtures.any,
      cards: [CardFixtures.any],
    };
  }

  public static get withCardsTwo(): GameDrawMutation {
    return {
      ...GameDrawMutationFixtures.any,
      cards: [CardFixtures.any, CardFixtures.any],
    };
  }
}
