import { Module } from '@nestjs/common';

import { UserHttpApiModule } from '../../../../user/adapter/nest/modules/UserHttpApiModule';

@Module({
  imports: [UserHttpApiModule],
})
export class AppModule {}
