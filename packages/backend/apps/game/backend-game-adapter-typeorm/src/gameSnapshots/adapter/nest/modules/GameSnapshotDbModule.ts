import { Module } from '@nestjs/common';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder';

@Module({
  imports: [CardDbModule],
  providers: [GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder],
})
export class GameSnapshotDbModule {}
