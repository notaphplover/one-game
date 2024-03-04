import {
  gameInitialSnapshotPersistenceOutputPortSymbol,
  gameInitialSnapshotSlotPersistenceOutputPortSymbol,
} from '@cornie-js/backend-game-application/gameSnapshots';
import { DynamicModule, Module } from '@nestjs/common';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { GameDbModule } from '../../../../games/adapter/nest/modules/GameDbModule';
import { GameInitialSnapshotPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameInitialSnapshotPersistenceTypeOrmAdapter';
import { GameInitialSnapshotSlotPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameInitialSnapshotSlotPersistenceTypeOrmAdapter';
import { GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder } from '../../typeorm/builders/GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder';
import { GameInitialSnapshotFromGameInitialSnapshotDbBuilder } from '../../typeorm/builders/GameInitialSnapshotFromGameInitialSnapshotDbBuilder';
import { GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder';
import { GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder } from '../../typeorm/builders/GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder';
import { GameInitialSnapshotDb } from '../../typeorm/models/GameInitialSnapshotDb';
import { GameInitialSnapshotSlotDb } from '../../typeorm/models/GameInitialSnapshotSlotDb';
import { CreateGameInitialSnapshotSlotTypeOrmService } from '../../typeorm/services/CreateGameInitialSnapshotSlotTypeOrmService';
import { CreateGameInitialSnapshotTypeOrmService } from '../../typeorm/services/CreateGameInitialSnapshotTypeOrmService';

@Module({})
export class GameSnapshotDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [
        gameInitialSnapshotPersistenceOutputPortSymbol,
        gameInitialSnapshotSlotPersistenceOutputPortSymbol,
      ],
      global: false,
      imports: [
        DbModule.forRootAsync(dbModuleOptions),
        dbModuleOptions.builders.feature([
          GameInitialSnapshotDb,
          GameInitialSnapshotSlotDb,
        ]),
        CardDbModule,
        GameDbModule.forRootAsync(dbModuleOptions),
      ],
      module: GameSnapshotDbModule,
      providers: [
        CreateGameInitialSnapshotSlotTypeOrmService,
        CreateGameInitialSnapshotTypeOrmService,
        GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder,
        GameInitialSnapshotFromGameInitialSnapshotDbBuilder,
        GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder,
        GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder,
        {
          provide: gameInitialSnapshotPersistenceOutputPortSymbol,
          useClass: GameInitialSnapshotPersistenceTypeOrmAdapter,
        },
        {
          provide: gameInitialSnapshotSlotPersistenceOutputPortSymbol,
          useClass: GameInitialSnapshotSlotPersistenceTypeOrmAdapter,
        },
      ],
    };
  }
}
