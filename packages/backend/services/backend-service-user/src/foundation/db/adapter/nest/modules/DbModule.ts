import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { EnvModule } from '../../../../env/adapter/nest/modules/EnvModule';
import { EnvironmentService } from '../../../../env/application/services/EnvironmentService';
import { typeOrmEntities } from '../models/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvironmentService],
      useFactory: (
        environmentService: EnvironmentService,
      ): TypeOrmModuleOptions => ({
        ...environmentService.getEnvironment().typeOrmDatasourceOptions,
        entities: typeOrmEntities,
      }),
    }),
  ],
})
export class DbModule {}
