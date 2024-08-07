import { EnvironmentService, EnvModule } from '@cornie-js/backend-app-game-env';
import { revertMigration } from '@cornie-js/backend-game-adapter-typeorm';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSourceOptions } from 'typeorm';

async function revertLastMigration(): Promise<void> {
  const applicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(EnvModule);

  const environmentService: EnvironmentService =
    applicationContext.get(EnvironmentService);

  const dataSourceOptions: DataSourceOptions =
    environmentService.getEnvironment()
      .typeOrmDatasourceOptions as unknown as DataSourceOptions;

  await revertMigration(dataSourceOptions);
}

void revertLastMigration();
