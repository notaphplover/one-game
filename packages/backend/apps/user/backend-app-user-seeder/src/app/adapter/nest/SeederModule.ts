import {
  DbModuleOptions,
  provideTypeOrmDataSource,
} from '@cornie-js/backend-app-user-db';
import {
  DynamicModule,
  InjectionToken,
  Module,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Seeder } from '../../../seeder/application/modules/Seeder';
import { UserSeederModule } from '../../../user/adapter/nest/UserSeederModule';
import { UserSeeder } from '../../../user/application/UserSeeder';
import { dataSourceSymbol } from '../../application/models/datasourceSymbol';
import { seedersSymbol } from '../../application/models/seedersSymbol';
import { PipelineSeeder } from '../../application/seeders/PipelineSeeder';

@Module({})
export class SeederModule {
  public static forRootAsync(options: DbModuleOptions): DynamicModule {
    return {
      exports: [PipelineSeeder],
      global: false,
      imports: [...(options.imports ?? []), UserSeederModule],
      module: SeederModule,
      providers: [
        {
          inject: options.inject ?? [],
          provide: dataSourceSymbol,
          useFactory: async (
            ...args: (InjectionToken | OptionalFactoryDependency)[]
          ): Promise<DataSource> => {
            const typeOrmOptions: DataSourceOptions = (await options.useFactory(
              ...args,
            )) as DataSourceOptions;

            return provideTypeOrmDataSource(typeOrmOptions);
          },
        },
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
