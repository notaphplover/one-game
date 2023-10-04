import { HttpClient } from '@cornie-js/api-http-client';
import { Module } from '@nestjs/common';

import { HttpApiModuleOptions } from '../../../application/models/HttpApiModuleOptions';
import { HttpApiOptions } from '../../../application/models/HttpApiOptions';
import { buildHttpApiModuleOptions } from '../calculations/buildHttpApiOptions';

const options: HttpApiModuleOptions = buildHttpApiModuleOptions();

@Module({
  exports: [HttpClient],
  imports: [...(options.imports ?? [])],
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
})
export class HttpApiModule {}
