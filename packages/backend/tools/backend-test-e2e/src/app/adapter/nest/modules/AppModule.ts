import { Module } from '@nestjs/common';

import { EnvModule } from '../../../../env/adapter/nest/modules/EnvModule';

@Module({
  exports: [EnvModule],
  imports: [EnvModule],
})
export class AppModule {}
