import { Card } from '../../../cards/domain/valueObjects/Card';

export interface GameInitialSnapshotSlot {
  readonly cards: Card[];
  readonly position: number;
  readonly userId: string;
}
