import { FinishedGame } from '../entities/FinishedGame';
import { GameStatus } from '../valueObjects/GameStatus';
import { FinishedGameSlotFixtures } from './FinishedGameSlotFixtures';
import { GameSpecFixtures } from './GameSpecFixtures';

export class FinishedGameFixtures {
  public static get any(): FinishedGame {
    const fixture: FinishedGame = {
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      name: 'Game name',
      spec: GameSpecFixtures.any,
      state: {
        slots: [FinishedGameSlotFixtures.withPositionZero],
        status: GameStatus.finished,
      },
    };

    return fixture;
  }

  public static get withGameSlotsAmountOneAndSlotsOne(): FinishedGame {
    const anyFinishedGameFixture: FinishedGame = FinishedGameFixtures.any;

    return {
      ...anyFinishedGameFixture,
      spec: {
        ...anyFinishedGameFixture.spec,
        gameSlotsAmount: 1,
      },
      state: {
        ...anyFinishedGameFixture.state,
        slots: [FinishedGameSlotFixtures.withPositionZero],
      },
    };
  }
}
