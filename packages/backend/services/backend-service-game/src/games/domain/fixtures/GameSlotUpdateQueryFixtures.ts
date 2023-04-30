import { GameSlotUpdateQuery } from '../query/GameSlotUpdateQuery';
import { GameSlotFindQueryFixtures } from './GameSlotFindQueryFixtures';

export class GameSlotUpdateQueryFixtures {
  public static get any(): GameSlotUpdateQuery {
    return {
      gameSlotFindQuery: GameSlotFindQueryFixtures.any,
    };
  }
}
