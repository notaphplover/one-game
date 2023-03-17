import { Module } from '@nestjs/common';

import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { EnvModule } from '../../../../foundation/env/adapter/nest/modules/EnvModule';

@Module({
  imports: [DbModule, EnvModule],
})
export class AppModule {}
