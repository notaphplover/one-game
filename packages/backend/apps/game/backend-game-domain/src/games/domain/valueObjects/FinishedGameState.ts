import { FinishedGameSlot } from './FinishedGameSlot';
import { GameStatus } from './GameStatus';

export interface FinishedGameState {
  readonly slots: FinishedGameSlot[];
  readonly status: GameStatus.finished;
}
