import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-user-env';
import { runMigrations } from '@cornie-js/backend-user-adapter-typeorm';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSourceOptions } from 'typeorm';

const ATTEMPS: number = 5;
const SLEEP_MS_PER_ATTEMPT: number = 2500;

async function runPendingMigrations(): Promise<void> {
  for (let i: number = 0; i < ATTEMPS; ++i) {
    try {
      await runPendingMigrationsAttempt();

      return;
    } catch (error: unknown) {
      console.log(
        `An error happened while running pending migrations. Attemp: ${i}.`,
      );

      await sleep(SLEEP_MS_PER_ATTEMPT);
    }
  }

  throw new Error(
    'Unable to run migrations. Too many attempts resulted in an error.',
  );
}

async function runPendingMigrationsAttempt(): Promise<void> {
  const applicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(EnvModule);

  const environmentService: EnvironmentService =
    applicationContext.get(EnvironmentService);

  const dataSourceOptions: DataSourceOptions =
    environmentService.getEnvironment()
      .typeOrmDatasourceOptions as unknown as DataSourceOptions;

  await runMigrations(dataSourceOptions);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve: (value: void | PromiseLike<void>) => void) => {
    setTimeout(resolve, ms);
  });
}

void runPendingMigrations();
