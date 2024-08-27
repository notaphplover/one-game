import { transactionProvisionOutputPortSymbol } from '@cornie-js/backend-game-application/foundation/db';
import { DynamicModule, Module } from '@nestjs/common';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { TransactionProvisionTypeOrmAdapter } from '../../typeorm/adapters/TransactionProvisionTypeOrmAdapter';
import { NumberToBooleanTransformer } from '../../typeorm/transformers/NumberToBooleanTransformer';
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
      exports: [NumberToBooleanTransformer],
      global: false,
      imports: [options.builders.root(typeOrmModuleAsyncOptions)],
      module: DbModule,
      providers: [NumberToBooleanTransformer],
    };
  }

  public static forTransaction(): DynamicModule {
    return {
      exports: [transactionProvisionOutputPortSymbol],
      global: false,
      module: DbModule,
      providers: [
        {
          provide: transactionProvisionOutputPortSymbol,
          useClass: TransactionProvisionTypeOrmAdapter,
        },
      ],
    };
  }
}
