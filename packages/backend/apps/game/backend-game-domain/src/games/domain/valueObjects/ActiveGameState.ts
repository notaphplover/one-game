import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { ActiveGameSlot } from './ActiveGameSlot';
import { GameCardSpec } from './GameCardSpec';
import { GameDirection } from './GameDirection';
import { GameStatus } from './GameStatus';

export interface ActiveGameState {
  readonly currentCard: Card;
  readonly currentColor: CardColor;
  readonly currentDirection: GameDirection;
  readonly currentPlayingSlotIndex: number;
  readonly currentTurnCardsPlayed: boolean;
  readonly deck: GameCardSpec[];
  readonly discardPile: GameCardSpec[];
  readonly drawCount: number;
  readonly slots: ActiveGameSlot[];
  readonly status: GameStatus.active;
}
