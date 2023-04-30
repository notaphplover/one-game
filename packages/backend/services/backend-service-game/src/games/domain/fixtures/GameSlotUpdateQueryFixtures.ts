import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameSlotUpdateQuery } from '../query/GameSlotUpdateQuery';
import { GameSlotFindQueryFixtures } from './GameSlotFindQueryFixtures';

export class GameSlotUpdateQueryFixtures {
  public static get any(): GameSlotUpdateQuery {
    return {
      gameSlotFindQuery: GameSlotFindQueryFixtures.any,
    };
  }

  public static get withCardsOne(): GameSlotUpdateQuery {
    return {
      ...GameSlotUpdateQueryFixtures.any,
      cards: [CardFixtures.any],
    };
  }
}
