import { HttpClient } from '@cornie-js/api-http-client';
import { DynamicModule, Module } from '@nestjs/common';

import { HttpApiModuleOptions } from '../../../application/models/HttpApiModuleOptions';
import { HttpApiOptions } from '../../../application/models/HttpApiOptions';

@Module({})
export class HttpApiModule {
  public static forRootAsync(options: HttpApiModuleOptions): DynamicModule {
    return {
      exports: [HttpClient],
      global: false,
      imports: [...(options.imports ?? [])],
      module: HttpApiModule,
      providers: [
        {
          inject: [...(options.inject ?? [])],
          provide: HttpClient,
          useFactory: async (...args: unknown[]): Promise<HttpClient> => {
            const httpApiOptions: HttpApiOptions = await options.useFactory(
              ...args,
            );

            return new HttpClient(httpApiOptions.baseUrl);
          },
        },
      ],
    };
  }
}
