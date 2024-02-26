import {
  GameInitialSnapshotSlot,
  GameInitialSnapshotSlotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';

export interface GameInitialSnapshotPersistenceOutputPort {
  create(
    gameInitialSnapshotSlotCreateQuery: GameInitialSnapshotSlotCreateQuery,
  ): Promise<GameInitialSnapshotSlot>;
}
