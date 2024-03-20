import { GameActionKind } from './GameActionKind';

export interface BaseGameAction<TKind extends GameActionKind> {
  readonly currentPlayingSlotIndex: number;
  readonly gameId: string;
  readonly id: string;
  readonly kind: TKind;
  readonly position: number;
  readonly turn: number;
}
