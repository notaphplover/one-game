import { GameActionKind } from '../valueObjects/GameActionKind';

export interface BaseGameActionCreateQuery<TKind extends GameActionKind> {
  currentPlayingSlotIndex: number;
  gameId: string;
  id: string;
  kind: TKind;
  turn: number;
}
