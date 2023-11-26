import { GameSpec } from '../valueObjects/GameSpec';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';
import { GameOptionsFixtures } from './GameOptionsFixtures';

export class GameSpecFixtures {
  public static get any(): GameSpec {
    return {
      cards: [GameCardSpecFixtures.any],
      gameSlotsAmount: 1,
      options: GameOptionsFixtures.any,
    };
  }

  public static get withCardsOne(): GameSpec {
    return {
      ...GameSpecFixtures.any,
      cards: [GameCardSpecFixtures.any],
    };
  }

  public static get withCardsOneWithAmount120(): GameSpec {
    return {
      cards: [GameCardSpecFixtures.withAmount120],
      gameSlotsAmount: 2,
      options: GameOptionsFixtures.any,
    };
  }

  public static get withGameSlotsAmountOne(): GameSpec {
    return {
      ...GameSpecFixtures.any,
      gameSlotsAmount: 1,
    };
  }
}
