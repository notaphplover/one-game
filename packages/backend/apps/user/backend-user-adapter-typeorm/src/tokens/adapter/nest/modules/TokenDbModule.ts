import { DynamicModule, Module } from '@nestjs/common';

import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder } from '../../typeorm/builders/RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder';
import { RefreshTokenFromRefreshTokenDbBuilder } from '../../typeorm/builders/RefreshTokenFromRefreshTokenDbBuilder';
import { RefreshTokenDb } from '../../typeorm/models/RefreshTokenDb';
import { CreateRefreshTokenTypeOrmService } from '../../typeorm/services/CreateRefreshTokenTypeOrmService';

@Module({})
export class TokenDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [],
      global: false,
      imports: [
        DbModule.forRootAsync(dbModuleOptions),
        dbModuleOptions.builders.feature([RefreshTokenDb]),
      ],
      module: TokenDbModule,
      providers: [
        CreateRefreshTokenTypeOrmService,
        RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder,
        RefreshTokenFromRefreshTokenDbBuilder,
      ],
    };
  }
}
