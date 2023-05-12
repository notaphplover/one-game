import { provideTypeOrmDataSource as provideTypeOrmDataSourceFromOptions } from '@cornie-js/backend-app-user-db';
import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-user-env';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource, DataSourceOptions } from 'typeorm';

export async function provideTypeOrmDataSource(): Promise<DataSource> {
  const applicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(EnvModule);

  const environmentService: EnvironmentService =
    applicationContext.get(EnvironmentService);

  const dataSourceOptions: DataSourceOptions =
    environmentService.getEnvironment()
      .typeOrmDatasourceOptions as unknown as DataSourceOptions;

  return provideTypeOrmDataSourceFromOptions(dataSourceOptions);
}
