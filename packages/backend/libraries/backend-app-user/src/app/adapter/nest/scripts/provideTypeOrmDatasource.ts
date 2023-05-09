import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-user-env';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource, DataSourceOptions } from 'typeorm';

import { typeOrmEntities } from '../../../../foundation/db/adapter/nest/models/entities';
import { typeOrmMigrationFolders } from '../../../../foundation/db/adapter/nest/models/migrationFolders';

export async function provideTypeOrmDataSource(): Promise<DataSource> {
  const applicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(EnvModule);

  const environmentService: EnvironmentService =
    applicationContext.get(EnvironmentService);

  const dataSourceOptions: DataSourceOptions =
    environmentService.getEnvironment()
      .typeOrmDatasourceOptions as unknown as DataSourceOptions;

  return new DataSource({
    ...dataSourceOptions,
    entities: typeOrmEntities,
    migrations: typeOrmMigrationFolders,
  });
}
