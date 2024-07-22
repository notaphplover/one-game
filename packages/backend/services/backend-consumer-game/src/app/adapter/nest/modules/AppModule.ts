import { Module } from '@nestjs/common';

import { StatusHttpApiModule } from '../../../../status/adapter/nest/modules/StatusHttpApiModule';

@Module({
  imports: [StatusHttpApiModule],
})
export class AppModule {}
