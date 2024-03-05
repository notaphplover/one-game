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

  public static get withIsDiscardPileEmptiedFalse(): GameDrawMutation {
    return {
      ...GameDrawMutationFixtures.any,
      isDiscardPileEmptied: false,
    };
  }

  public static get withIsDiscardPileEmptiedTrue(): GameDrawMutation {
    return {
      ...GameDrawMutationFixtures.any,
      isDiscardPileEmptied: true,
    };
  }
}
