import { CardFixtures } from '../../../cards/domain/fixtures';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';

export class GameInitialDrawsMutationFixtures {
  public static get any(): GameInitialDrawsMutation {
    return {
      cards: [[CardFixtures.any]],
      currentCard: CardFixtures.any,
      deck: [GameCardSpecFixtures.any],
    };
  }

  public static get withCardsOneCardArray(): GameInitialDrawsMutation {
    return {
      ...GameInitialDrawsMutationFixtures.any,
      cards: [[CardFixtures.any]],
    };
  }
}
