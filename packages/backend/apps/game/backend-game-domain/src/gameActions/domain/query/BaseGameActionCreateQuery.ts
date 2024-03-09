import { GameActionKind } from '../valueObjects/GameActionKind';

export interface BaseGameActionCreateQuery<TKind extends GameActionKind> {
  currentPlayingSlotIndex: number;
  id: string;
  kind: TKind;
  position: number;
  turn: number;
}
