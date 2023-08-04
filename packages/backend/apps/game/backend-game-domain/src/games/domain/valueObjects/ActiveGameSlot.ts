import { Card } from '../../../cards/domain/valueObjects/Card';
import { BaseGameSlot } from './BaseGameSlot';

export interface ActiveGameSlot extends BaseGameSlot {
  readonly cards: Card[];
}
