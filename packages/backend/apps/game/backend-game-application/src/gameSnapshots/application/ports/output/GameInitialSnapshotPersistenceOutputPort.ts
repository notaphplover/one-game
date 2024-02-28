import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameInitialSnapshot,
  GameInitialSnapshotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';

export const gameInitialSnapshotPersistenceOutputPortSymbol: symbol =
  Symbol.for('GameInitialSnapshotPersistenceOutputPort');

export interface GameInitialSnapshotPersistenceOutputPort {
  create(
    gameInitialSnapshotSlotCreateQuery: GameInitialSnapshotCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameInitialSnapshot>;
}
