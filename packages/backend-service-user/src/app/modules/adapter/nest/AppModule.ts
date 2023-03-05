import { Module } from '@nestjs/common';

import { EnvModule } from '../../../../foundation/env/modules/adapter/nest/EnvModule';

@Module({
  imports: [EnvModule],
})
export class AppModule {}
