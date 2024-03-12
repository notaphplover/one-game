import { GameAction } from '../valueObjects/GameAction';
import { GameActionKind } from '../valueObjects/GameActionKind';

export class GameActionFixtures {
  public static get any(): GameAction {
    return {
      currentPlayingSlotIndex: 0,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      kind: GameActionKind.passTurn,
      position: 1,
      turn: 1,
    };
  }
}
