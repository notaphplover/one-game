import { Module } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapter/nest/modules/AuthModule';
import { ApplicationResolver } from '../../../application/resolvers/ApplicationResolver';

@Module({
  exports: [ApplicationResolver],
  imports: [AuthModule],
  providers: [ApplicationResolver],
})
export class ApplicationModule {}
