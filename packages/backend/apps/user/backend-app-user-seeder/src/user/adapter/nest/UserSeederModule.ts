import { DbModuleOptions, DbModule } from '@cornie-js/backend-app-user-db';
import { UserDb } from '@cornie-js/backend-app-user-db/entities';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSeeder } from '../../application/UserSeeder';

@Module({})
export class UserSeederModule {
  public static forRootAsync(options: DbModuleOptions): DynamicModule {
    return {
      exports: [UserSeeder],
      global: false,
      imports: [
        DbModule.forRootAsync(options),
        TypeOrmModule.forFeature([UserDb]),
      ],
      module: UserSeederModule,
      providers: [UserSeeder],
    };
  }
}
