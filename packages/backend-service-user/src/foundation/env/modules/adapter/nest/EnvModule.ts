import { Module } from '@nestjs/common';

import { EnvironmentLoader } from '../../../services/EnvironmentLoader';
import { EnvironmentService } from '../../../services/EnvironmentService';

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
