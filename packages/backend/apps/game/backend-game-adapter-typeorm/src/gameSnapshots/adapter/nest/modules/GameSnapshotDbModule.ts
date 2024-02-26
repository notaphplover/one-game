import { Module } from '@nestjs/common';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder';
import { GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder';

@Module({
  imports: [CardDbModule],
  providers: [
    GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder,
    GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder,
  ],
})
export class GameSnapshotDbModule {}
