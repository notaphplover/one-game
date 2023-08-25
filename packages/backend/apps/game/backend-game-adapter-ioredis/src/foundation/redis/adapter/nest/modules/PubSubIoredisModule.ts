import { DynamicModule, Module } from '@nestjs/common';
import Redis from 'ioredis';

import { ioredisClientSymbol } from '../models/ioredisClientSymbol';
import { PubSubIoredisModuleOptions } from '../models/PubSubIoredisModuleOptions';
import { IoredisShutdownService } from '../services/IoredisShutDownService';

@Module({})
export class PubSubIoredisModule {
  public static forRootAsync(
    options: PubSubIoredisModuleOptions,
  ): DynamicModule {
    const module: DynamicModule = {
      exports: [ioredisClientSymbol],
      global: false,
      module: PubSubIoredisModule,
      providers: [
        {
          inject: options.inject ?? [],
          provide: ioredisClientSymbol,
          useFactory: (...args: unknown[]): Redis =>
            new Redis(options.useFactory(...args)),
        },
        IoredisShutdownService,
      ],
    };

    if (options.imports !== undefined) {
      module.imports = options.imports;
    }

    return module;
  }
}
