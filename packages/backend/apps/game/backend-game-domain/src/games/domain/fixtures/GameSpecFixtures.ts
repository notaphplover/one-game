import { GameSpec } from '../valueObjects/GameSpec';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';
import { GameOptionsFixtures } from './GameOptionsFixtures';

export class GameSpecFixtures {
  public static get any(): GameSpec {
    return {
      cards: [GameCardSpecFixtures.any],
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
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

  public static get withCardsOneWithAmount120AndGameSlotsAmountTwo(): GameSpec {
    return {
      ...GameSpecFixtures.any,
      cards: [GameCardSpecFixtures.withAmount120],
      gameSlotsAmount: 2,
    };
  }

  public static get withGameSlotsAmountOne(): GameSpec {
    return {
      ...GameSpecFixtures.any,
      gameSlotsAmount: 1,
    };
  }

  public static get withGameSlotsAmountTwo(): GameSpec {
    return {
      ...GameSpecFixtures.any,
      gameSlotsAmount: 2,
    };
  }
}
