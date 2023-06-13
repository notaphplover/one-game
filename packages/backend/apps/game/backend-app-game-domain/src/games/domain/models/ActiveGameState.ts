import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { GameDirection } from '../models/GameDirection';
import { ActiveGameSlot } from './ActiveGameSlot';
import { GameCardSpec } from './GameCardSpec';

export interface ActiveGameState {
  readonly active: true;
  readonly currentCard: Card;
  readonly currentColor: CardColor;
  readonly currentDirection: GameDirection;
  readonly currentPlayingSlotIndex: number;
  readonly deck: GameCardSpec[];
  readonly drawCount: number;
  readonly slots: ActiveGameSlot[];
}
