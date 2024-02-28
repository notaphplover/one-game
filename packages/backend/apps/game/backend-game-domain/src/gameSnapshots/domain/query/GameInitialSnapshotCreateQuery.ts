import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameCardSpec } from '../../../games/domain/valueObjects/GameCardSpec';
import { GameDirection } from '../../../games/domain/valueObjects/GameDirection';
import { GameInitialSnapshotSlotCreateQuery } from './GameInitialSnapshotSlotCreateQuery';

export interface GameInitialSnapshotCreateQuery {
  readonly currentCard: Card;
  readonly currentColor: CardColor;
  readonly currentDirection: GameDirection;
  readonly currentPlayingSlotIndex: number;
  readonly deck: GameCardSpec[];
  readonly drawCount: number;
  readonly gameId: string;
  readonly gameSlotCreateQueries: GameInitialSnapshotSlotCreateQuery[];
  readonly id: string;
}
