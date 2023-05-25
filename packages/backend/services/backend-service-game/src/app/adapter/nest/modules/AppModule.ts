import { Module } from '@nestjs/common';

import { GameHttpApiModule } from '../../../../games/adapter/nest/modules/GameHttpApiModule';

@Module({
  imports: [GameHttpApiModule],
})
export class AppModule {}
