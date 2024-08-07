import { JwtService } from '@cornie-js/backend-jwt';
import { DynamicModule, Module } from '@nestjs/common';

import { JwtModuleOptions } from '../models/JwtModuleOptions';

@Module({})
export class JwtModule {
  public static forRootAsync(options: JwtModuleOptions): DynamicModule {
    const module: DynamicModule = {
      exports: [JwtService],
      global: false,
      module: JwtModule,
      providers: [
        {
          inject: options.inject ?? [],
          provide: JwtService,
          useFactory: (...args: unknown[]): JwtService =>
            new JwtService(options.useFactory(...args)),
        },
      ],
    };

    if (options.imports !== undefined) {
      module.imports = options.imports;
    }

    return module;
  }
}
