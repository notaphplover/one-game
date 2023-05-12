import { DynamicModule, Module } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { DbModuleOptions } from '../models/DbModuleOptions';
import { typeOrmEntities } from '../models/entities';

@Module({})
export class DbModule {
  public static forRootAsync(options: DbModuleOptions): DynamicModule {
    const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
      useFactory: async (
        ...args: unknown[]
      ): Promise<TypeOrmModuleOptions> => ({
        ...(await options.useFactory(...args)),
        entities: typeOrmEntities,
      }),
    };

    if (options.imports !== undefined) {
      typeOrmModuleAsyncOptions.imports = options.imports;
    }

    if (options.inject !== undefined) {
      typeOrmModuleAsyncOptions.inject = options.inject;
    }

    return {
      global: false,
      imports: [TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions)],
      module: DbModule,
    };
  }
}
