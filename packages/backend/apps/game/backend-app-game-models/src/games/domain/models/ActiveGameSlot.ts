import { Card } from '../../../cards/domain/models/Card';
import { BaseGameSlot } from './BaseGameSlot';

export interface ActiveGameSlot extends BaseGameSlot {
  readonly cards: Card[];
}
