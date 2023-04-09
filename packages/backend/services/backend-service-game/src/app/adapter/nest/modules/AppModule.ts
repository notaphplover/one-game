import { Module } from '@nestjs/common';

import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { EnvModule } from '../../../../foundation/env/adapter/nest/modules/EnvModule';
import { GameHttpApiModule } from '../../../../games/adapter/nest/modules/GameHttpApiModule';

@Module({
  imports: [DbModule, EnvModule, GameHttpApiModule],
})
export class AppModule {}
