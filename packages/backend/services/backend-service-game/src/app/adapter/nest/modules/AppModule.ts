import { Module } from '@nestjs/common';

import { GameHttpApiModule } from '../../../../games/adapter/nest/modules/GameHttpApiModule';
import { StatusHttpApiModule } from '../../../../status/adapter/nest/modules/StatusHttpApiModule';

@Module({
  imports: [GameHttpApiModule, StatusHttpApiModule],
})
export class AppModule {}
