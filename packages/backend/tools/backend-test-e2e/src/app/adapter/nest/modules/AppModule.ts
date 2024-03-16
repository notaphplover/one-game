import { GameIoredisModule } from '@cornie-js/backend-game-adapter-ioredis';
import {
  GameActionDbModule,
  DbModule as GameAdapterDbModule,
  GameDbModule,
  GameSnapshotDbModule,
} from '@cornie-js/backend-game-adapter-typeorm';
import { GameApplicationModule } from '@cornie-js/backend-game-application';
import { Module } from '@nestjs/common';

import { EnvModule } from '../../../../env/adapter/nest/modules/EnvModule';
import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { buildIoredisModuleOptions } from '../../../../foundation/redis/adapter/ioredis/calculations/buildIoredisModuleOptions';

@Module({
  exports: [EnvModule],
  imports: [
    EnvModule,
    GameApplicationModule.forRootAsync([
      GameAdapterDbModule.forTransaction(),
      GameActionDbModule.forRootAsync(buildDbModuleOptions()),
      GameDbModule.forRootAsync(buildDbModuleOptions()),
      GameIoredisModule.forRootAsync(buildIoredisModuleOptions()),
      GameSnapshotDbModule.forRootAsync(buildDbModuleOptions()),
    ]),
  ],
})
export class AppModule {}
