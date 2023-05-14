import { DbModuleOptions } from '@cornie-js/backend-app-user-db';
import { DynamicModule, Module } from '@nestjs/common';

import { Seeder } from '../../../seeder/application/modules/Seeder';
import { UserSeederModule } from '../../../user/adapter/nest/UserSeederModule';
import { UserSeeder } from '../../../user/application/UserSeeder';
import { seedersSymbol } from '../../application/models/seedersSymbol';
import { PipelineSeeder } from '../../application/seeders/PipelineSeeder';

@Module({})
export class SeederModule {
  public static forRootAsync(options: DbModuleOptions): DynamicModule {
    return {
      exports: [PipelineSeeder],
      global: false,
      imports: [UserSeederModule.forRootAsync(options)],
      module: SeederModule,
      providers: [
        PipelineSeeder,
        {
          inject: [UserSeeder],
          provide: seedersSymbol,
          useFactory: (...seeders: Seeder[]): Seeder[] => seeders,
        },
      ],
    };
  }
}
