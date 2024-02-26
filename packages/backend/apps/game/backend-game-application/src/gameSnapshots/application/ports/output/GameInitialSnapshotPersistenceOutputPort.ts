import {
  GameInitialSnapshotSlot,
  GameInitialSnapshotSlotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';

export const gameInitialSnapshotPersistenceOutputPortSymbol: symbol =
  Symbol.for('GameInitialSnapshotPersistenceOutputPort');

export interface GameInitialSnapshotPersistenceOutputPort {
  create(
    gameInitialSnapshotSlotCreateQuery: GameInitialSnapshotSlotCreateQuery,
  ): Promise<GameInitialSnapshotSlot>;
}
