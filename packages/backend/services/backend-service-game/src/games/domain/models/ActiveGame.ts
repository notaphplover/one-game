import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { ActiveGameSlot } from './ActiveGameSlot';
import { BaseGame } from './BaseGame';

export interface ActiveGame extends BaseGame {
  readonly active: true;
  readonly currentCard: Card;
  readonly currentColor: CardColor;
  readonly currentPlayingSlotIndex: number;
  readonly slots: ActiveGameSlot[];
}
