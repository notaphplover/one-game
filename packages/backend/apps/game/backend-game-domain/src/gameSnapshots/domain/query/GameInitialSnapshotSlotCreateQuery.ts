import { Card } from '../../../cards/domain/valueObjects/Card';

export interface GameInitialSnapshotSlotCreateQuery {
  readonly cards: Card[];
  readonly gameInitialSnapshotId: string;
  readonly id: string;
  readonly position: number;
  readonly userId: string;
}
