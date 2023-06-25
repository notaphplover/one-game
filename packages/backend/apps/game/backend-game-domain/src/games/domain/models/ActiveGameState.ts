import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { ActiveGameSlot } from './ActiveGameSlot';
import { GameCardSpec } from './GameCardSpec';
import { GameDirection } from './GameDirection';

export interface ActiveGameState {
  readonly active: true;
  readonly currentCard: Card;
  readonly currentColor: CardColor;
  readonly currentDirection: GameDirection;
  readonly currentPlayingSlotIndex: number;
  readonly currentTurnCardsPlayed: boolean;
  readonly deck: GameCardSpec[];
  readonly drawCount: number;
  readonly slots: ActiveGameSlot[];
}
