import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { EnvModule } from '../../../../env/modules/adapter/nest/EnvModule';
import { EnvironmentService } from '../../../../env/services/EnvironmentService';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvironmentService],
      useFactory: (
        environmentService: EnvironmentService,
      ): TypeOrmModuleOptions =>
        environmentService.getEnvironment().typeOrmDatasourceOptions,
    }),
  ],
})
export class DbModule {}
