import { GameActionKind } from '../valueObjects/GameActionKind';
import { BaseGameActionCreateQuery } from './BaseGameActionCreateQuery';

export interface PassTurnGameActionCreateQuery
  extends BaseGameActionCreateQuery<GameActionKind.passTurn> {
  nextPlayingSlotIndex: number | null;
}
