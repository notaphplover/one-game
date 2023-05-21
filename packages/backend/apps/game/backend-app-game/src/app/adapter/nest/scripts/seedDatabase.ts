import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-game-env';
import {
  PipelineSeeder,
  SeederModule,
} from '@cornie-js/backend-app-game-seeder';
import { DynamicModule, INestApplicationContext, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';

@Module({})
class SeedDatabaseModule {
  public static forRoot(seederModule: DynamicModule): DynamicModule {
    return {
      exports: [EnvModule, seederModule],
      global: false,
      imports: [EnvModule, seederModule],
      module: SeedDatabaseModule,
    };
  }
}

export async function seedDatabase(): Promise<void> {
  const seederModule: DynamicModule = SeederModule.forRootAsync(
    buildDbModuleOptions(),
  );

  const nestAppContext: INestApplicationContext =
    await NestFactory.createApplicationContext(
      SeedDatabaseModule.forRoot(seederModule),
    );

  const environmentService: EnvironmentService =
    nestAppContext.get(EnvironmentService);

  const seedDummyData: boolean =
    environmentService.getEnvironment().seedDummyData;

  const pipelineSeeder: PipelineSeeder = nestAppContext.get(PipelineSeeder);

  await pipelineSeeder.seed({
    seedDummy: seedDummyData,
  });

  await nestAppContext.close();
}
