import { Module } from '@nestjs/common';

import { AuthHttpApiModule } from '../../../../auth/adapters/nest/modules/AuthHttpApiModule';
import { UserHttpApiModule } from '../../../../user/adapter/nest/modules/UserHttpApiModule';

@Module({
  imports: [AuthHttpApiModule, UserHttpApiModule],
})
export class AppModule {}
