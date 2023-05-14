import {
  PipelineSeeder,
  SeederModule,
} from '@cornie-js/backend-app-user-seeder';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';

export async function seedDatabase(): Promise<void> {
  const nestAppContext: INestApplicationContext =
    await NestFactory.createApplicationContext(
      SeederModule.forRootAsync(buildDbModuleOptions()),
    );

  const pipelineSeeder: PipelineSeeder = nestAppContext.get(PipelineSeeder);

  await pipelineSeeder.seed();

  await nestAppContext.close();
}
