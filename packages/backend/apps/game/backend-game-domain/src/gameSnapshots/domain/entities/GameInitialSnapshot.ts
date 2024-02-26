import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameCardSpec } from '../../../games/domain/valueObjects/GameCardSpec';
import { GameDirection } from '../../../games/domain/valueObjects/GameDirection';
import { GameInitialSnapshotSlot } from './GameInitialSnapshotSlot';

export interface GameInitialSnapshot {
  readonly currentCard: Card;
  readonly currentColor: CardColor;
  readonly currentDirection: GameDirection;
  readonly currentPlayingSlotIndex: number;
  readonly deck: GameCardSpec[];
  readonly drawCount: number;
  readonly id: string;
  readonly slots: GameInitialSnapshotSlot[];
}
