import { Module } from '@nestjs/common';

import { EnvironmentLoader } from '../../../services/EnvironmentLoader';

@Module({
  providers: [
    {
      provide: EnvironmentLoader,
      useFactory: () => EnvironmentLoader.build(),
    },
  ],
})
export class EnvModule {}
