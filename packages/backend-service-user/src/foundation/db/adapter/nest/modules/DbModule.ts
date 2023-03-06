import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { EnvModule } from '../../../../env/adapter/nest/modules/EnvModule';
import { EnvironmentService } from '../../../../env/application/services/EnvironmentService';

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
