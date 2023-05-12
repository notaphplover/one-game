import { Module } from '@nestjs/common';

import { EnvironmentLoader } from '../../../application/services/EnvironmentLoader';
import { EnvironmentService } from '../../../application/services/EnvironmentService';

@Module({
  exports: [EnvironmentService],
  providers: [
    {
      provide: EnvironmentLoader,
      useFactory: () => EnvironmentLoader.build(),
    },
    EnvironmentService,
  ],
})
export class EnvModule {}
