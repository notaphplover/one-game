import { GameOptionsCreateQueryFixtures } from '.';
import { GameSpecCreateQuery } from '../query/GameSpecCreateQuery';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';

export class GameSpecCreateQueryFixtures {
  public static get any(): GameSpecCreateQuery {
    return {
      cards: [GameCardSpecFixtures.any],
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      gameSlotsAmount: 2,
      id: 'e3b54159-a4ef-41fc-094a-20709526bdaf',
      options: GameOptionsCreateQueryFixtures.any,
    };
  }
}
