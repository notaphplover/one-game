import { NonStartedGame } from '../models/NonStartedGame';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';
import { NonStartedGameSlotFixtures } from './NonStartedGameSlotFixtures';

export class NonStartedGameFixtures {
  public static get any(): NonStartedGame {
    const fixture: NonStartedGame = {
      active: false,
      deck: [],
      gameSlotsAmount: 1,
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      slots: [NonStartedGameSlotFixtures.withPositionZero],
      spec: [GameCardSpecFixtures.any],
    };

    return fixture;
  }

  public static get withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount0(): NonStartedGame {
    return {
      ...NonStartedGameFixtures.any,
      deck: [GameCardSpecFixtures.withAmount0],
      gameSlotsAmount: 2,
      slots: [
        NonStartedGameSlotFixtures.withPositionZero,
        NonStartedGameSlotFixtures.withPositionOne,
      ],
    };
  }

  public static get withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120(): NonStartedGame {
    return {
      ...NonStartedGameFixtures.any,
      deck: [GameCardSpecFixtures.withAmount120],
      gameSlotsAmount: 2,
      slots: [
        NonStartedGameSlotFixtures.withPositionZero,
        NonStartedGameSlotFixtures.withPositionOne,
      ],
    };
  }

  public static get withGameSlotsAmountOneAndSlotsOne(): NonStartedGame {
    return {
      ...NonStartedGameFixtures.any,
      gameSlotsAmount: 1,
      slots: [NonStartedGameSlotFixtures.withPositionZero],
    };
  }

  public static get withGameSlotsAmountOneAndSlotsZero(): NonStartedGame {
    return {
      ...NonStartedGameFixtures.any,
      gameSlotsAmount: 1,
      slots: [],
    };
  }
}
