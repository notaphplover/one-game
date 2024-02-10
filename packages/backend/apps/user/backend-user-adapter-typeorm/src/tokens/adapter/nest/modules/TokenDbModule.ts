import { DynamicModule, Module } from '@nestjs/common';

import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { RefreshTokenFromRefreshTokenDbBuilder } from '../../typeorm/builders/RefreshTokenFromRefreshTokenDbBuilder';
import { RefreshTokenDb } from '../../typeorm/models/RefreshTokenDb';

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
      providers: [RefreshTokenFromRefreshTokenDbBuilder],
    };
  }
}
