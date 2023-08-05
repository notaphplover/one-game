import { Card } from '../../../cards/domain/valueObjects/Card';
import { BaseGameSlot } from './BaseGameSlot';

export interface FinishedGameSlot extends BaseGameSlot {
  readonly cards: Card[];
}
