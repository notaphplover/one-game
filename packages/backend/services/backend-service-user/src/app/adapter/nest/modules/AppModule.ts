import { Module } from '@nestjs/common';

import { AuthHttpApiModule } from '../../../../auth/adapters/nest/modules/AuthHttpApiModule';
import { StatusHttpApiModule } from '../../../../status/adapter/nest/modules/StatusHttpApiModule';
import { UserHttpApiModule } from '../../../../user/adapter/nest/modules/UserHttpApiModule';

@Module({
  imports: [AuthHttpApiModule, StatusHttpApiModule, UserHttpApiModule],
})
export class AppModule {}
