import { BaseGameAction } from './BaseGameAction';
import { GameActionKind } from './GameActionKind';

export interface PassTurnGameAction
  extends BaseGameAction<GameActionKind.passTurn> {
  nextPlayingSlotIndex: number | null;
}
