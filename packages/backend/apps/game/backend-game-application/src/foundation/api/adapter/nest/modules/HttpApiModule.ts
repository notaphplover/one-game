import { HttpClient } from '@cornie-js/api-http-client';
import { DynamicModule, Module } from '@nestjs/common';

import { HttpApiModuleOptions } from '../../../application/models/HttpApiModuleOptions';
import { HttpApiOptions } from '../../../application/models/HttpApiOptions';
import { buildHttpApiModuleOptions } from '../calculations/buildHttpApiOptions';

@Module({})
export class HttpApiModule {
  public static forRootAsync(): DynamicModule {
    const options: HttpApiModuleOptions = buildHttpApiModuleOptions();

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
