import { DynamicModule, Module } from '@nestjs/common';

import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder } from '../../typeorm/builders/GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder';
import { GameActionFromGameActionDbBuilder } from '../../typeorm/builders/GameActionFromGameActionDbBuilder';
import { GameActionDb } from '../../typeorm/models/GameActionDb';

@Module({})
export class GameActionsDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [],
      global: false,
      imports: [
        DbModule.forRootAsync(dbModuleOptions),
        dbModuleOptions.builders.feature([GameActionDb]),
      ],
      module: GameActionsDbModule,
      providers: [
        GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder,
        GameActionFromGameActionDbBuilder,
      ],
    };
  }
}
