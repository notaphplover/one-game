import { runMigrations } from '@cornie-js/backend-app-game-db';
import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-game-env';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSourceOptions } from 'typeorm';

async function runPendingMigrations(): Promise<void> {
  const applicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(EnvModule);

  const environmentService: EnvironmentService =
    applicationContext.get(EnvironmentService);

  const dataSourceOptions: DataSourceOptions =
    environmentService.getEnvironment()
      .typeOrmDatasourceOptions as unknown as DataSourceOptions;

  await runMigrations(dataSourceOptions);
}

void runPendingMigrations();
