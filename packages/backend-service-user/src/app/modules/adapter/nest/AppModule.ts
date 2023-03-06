import { Module } from '@nestjs/common';

import { UserModule } from '../../../../user/adapter/nest/modules/UserModule';

@Module({
  imports: [UserModule],
})
export class AppModule {}
