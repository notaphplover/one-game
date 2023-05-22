import { DynamicModule, Module } from '@nestjs/common';

import { buildHttpApiModuleOptions } from '../../../../foundation/api/adapter/nest/calculations/buildHttpApiOptions';
import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { GameModule } from '../../../../games/adapter/nest/modules/GameModule';
import { UserModule } from '../../../../user/adapter/nest/modules/UserModule';

const gameModule: DynamicModule = GameModule.forRootAsync(
  buildDbModuleOptions(),
);

const userModule: DynamicModule = UserModule.forRootAsync(
  buildHttpApiModuleOptions(),
);

@Module({
  exports: [gameModule, userModule],
  imports: [gameModule, userModule],
})
export class AppModule {}
