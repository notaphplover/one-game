import { GameSpec } from '../valueObjects/GameSpec';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';

export class GameSpecFixtures {
  public static get any(): GameSpec {
    return {
      cards: [GameCardSpecFixtures.any],
      gameSlotsAmount: 1,
    };
  }

  public static get withCardsOne(): GameSpec {
    return {
      ...GameSpecFixtures.any,
      cards: [GameCardSpecFixtures.any],
    };
  }

  public static get withGameSlotsAmountOne(): GameSpec {
    return {
      ...GameSpecFixtures.any,
      gameSlotsAmount: 1,
    };
  }
}
