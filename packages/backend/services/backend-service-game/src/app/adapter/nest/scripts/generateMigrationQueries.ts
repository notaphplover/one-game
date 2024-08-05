import { EnvironmentService, EnvModule } from '@cornie-js/backend-app-game-env';
import { generateMigrationQueries as generateTypeOrmMigrationQueries } from '@cornie-js/backend-game-adapter-typeorm';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSourceOptions } from 'typeorm';

async function generateMigrationQueries(): Promise<void> {
  const applicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(EnvModule);

  const environmentService: EnvironmentService =
    applicationContext.get(EnvironmentService);

  const dataSourceOptions: DataSourceOptions =
    environmentService.getEnvironment()
      .typeOrmDatasourceOptions as unknown as DataSourceOptions;

  await generateTypeOrmMigrationQueries(dataSourceOptions);
}

void generateMigrationQueries();
