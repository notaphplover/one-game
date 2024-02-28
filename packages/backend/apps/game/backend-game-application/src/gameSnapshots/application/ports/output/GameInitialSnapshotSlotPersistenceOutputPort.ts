import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameInitialSnapshotSlot,
  GameInitialSnapshotSlotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';

export const gameInitialSnapshotSlotPersistenceOutputPortSymbol: symbol =
  Symbol.for('GameInitialSnapshotSlotPersistenceOutputPort');

export interface GameInitialSnapshotSlotPersistenceOutputPort {
  create(
    gameInitialSnapshotSlotCreateQuery: GameInitialSnapshotSlotCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameInitialSnapshotSlot>;
}
