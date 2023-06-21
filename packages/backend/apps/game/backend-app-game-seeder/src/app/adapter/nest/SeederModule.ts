import { DbModuleOptions } from '@cornie-js/backend-game-adapter-typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { Seeder } from '../../../seeder/application/modules/Seeder';
import { seedersSymbol } from '../../application/models/seedersSymbol';
import { PipelineSeeder } from '../../application/seeders/PipelineSeeder';

@Module({})
export class SeederModule {
  public static forRootAsync(_options: DbModuleOptions): DynamicModule {
    return {
      exports: [PipelineSeeder],
      global: false,
      imports: [],
      module: SeederModule,
      providers: [
        PipelineSeeder,
        {
          inject: [],
          provide: seedersSymbol,
          useFactory: (...seeders: Seeder[]): Seeder[] => seeders,
        },
      ],
    };
  }
}
