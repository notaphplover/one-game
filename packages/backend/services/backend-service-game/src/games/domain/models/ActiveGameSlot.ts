import { Card } from '../../../cards/domain/models/Card';

export interface ActiveGameSlot {
  readonly cards: Card[];
  readonly userId: string;
}
