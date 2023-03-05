import { Module } from '@nestjs/common';

import { DbModule } from '../../../../foundation/db/modules/adapter/nest/DbModule';

@Module({
  imports: [DbModule],
})
export class AppModule {}
