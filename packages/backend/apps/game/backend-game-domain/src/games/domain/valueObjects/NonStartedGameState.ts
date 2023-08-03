import { GameStatus } from './GameStatus';
import { NonStartedGameSlot } from './NonStartedGameSlot';

export interface NonStartedGameState {
  readonly slots: NonStartedGameSlot[];
  readonly status: GameStatus.nonStarted;
}
