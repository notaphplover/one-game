import { gameInitialSnapshotPersistenceOutputPortSymbol } from '@cornie-js/backend-game-application/gameSnapshots';
import { Module } from '@nestjs/common';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { GameInitialSnapshotSlotPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameInitialSnapshotSlotPersistenceTypeOrmAdapter';
import { GameInitialSnapshotFromGameInitialSnapshotDbBuilder } from '../../typeorm/builders/GameInitialSnapshotFromGameInitialSnapshotDbBuilder';
import { GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder';
import { GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder';
import { CreateGameInitialSnapshotSlotTypeOrmService } from '../../typeorm/services/CreateGameInitialSnapshotSlotTypeOrmService';
import { CreateGameInitialSnapshotTypeOrmService } from '../../typeorm/services/CreateGameInitialSnapshotTypeOrmService';

@Module({
  exports: [gameInitialSnapshotPersistenceOutputPortSymbol],
  imports: [CardDbModule],
  providers: [
    CreateGameInitialSnapshotSlotTypeOrmService,
    CreateGameInitialSnapshotTypeOrmService,
    GameInitialSnapshotFromGameInitialSnapshotDbBuilder,
    GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder,
    GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder,
    {
      provide: gameInitialSnapshotPersistenceOutputPortSymbol,
      useClass: GameInitialSnapshotSlotPersistenceTypeOrmAdapter,
    },
  ],
})
export class GameSnapshotDbModule {}
