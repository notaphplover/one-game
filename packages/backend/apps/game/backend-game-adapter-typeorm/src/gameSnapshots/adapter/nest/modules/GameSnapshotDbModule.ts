import { gameInitialSnapshotPersistenceOutputPortSymbol } from '@cornie-js/backend-game-application/gameSnapshots';
import { Module } from '@nestjs/common';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { GameInitialSnapshotPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameInitialSnapshotPersistenceTypeOrmAdapter';
import { GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder';
import { GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder';

@Module({
  exports: [gameInitialSnapshotPersistenceOutputPortSymbol],
  imports: [CardDbModule],
  providers: [
    GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder,
    GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder,
    {
      provide: gameInitialSnapshotPersistenceOutputPortSymbol,
      useClass: GameInitialSnapshotPersistenceTypeOrmAdapter,
    },
  ],
})
export class GameSnapshotDbModule {}
