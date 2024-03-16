import { gameActionPersistenceOutputPortSymbol } from '@cornie-js/backend-game-application/gameActions';
import { DynamicModule, Module } from '@nestjs/common';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { GameActionPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameActionPersistenceTypeOrmAdapter';
import { GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder } from '../../typeorm/builders/GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder';
import { GameActionFromGameActionDbBuilder } from '../../typeorm/builders/GameActionFromGameActionDbBuilder';
import { GameActionDb } from '../../typeorm/models/GameActionDb';
import { CreateGameActionTypeOrmService } from '../../typeorm/services/CreateGameActionTypeOrmService';

@Module({})
export class GameActionDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [gameActionPersistenceOutputPortSymbol],
      global: false,
      imports: [
        CardDbModule,
        DbModule.forRootAsync(dbModuleOptions),
        dbModuleOptions.builders.feature([GameActionDb]),
      ],
      module: GameActionDbModule,
      providers: [
        CreateGameActionTypeOrmService,
        GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder,
        GameActionFromGameActionDbBuilder,
        {
          provide: gameActionPersistenceOutputPortSymbol,
          useClass: GameActionPersistenceTypeOrmAdapter,
        },
      ],
    };
  }
}
