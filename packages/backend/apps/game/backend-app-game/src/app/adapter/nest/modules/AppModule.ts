import { DynamicModule, Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { GameModule } from '../../../../games/adapter/nest/modules/GameModule';

const gameModule: DynamicModule = GameModule.forRootAsync(
  buildDbModuleOptions(),
);

@Module({
  exports: [gameModule],
  imports: [gameModule],
})
export class AppModule {}
