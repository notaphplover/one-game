import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Client } from 'pulsar-client';

import { PulsarClientOptions } from '../../pulsar/models/PulsarClientOptions';
import { pulsarClientSymbol } from '../models/pulsarClientSymbol';
import { PulsarModuleRootOptions } from '../models/PulsarModuleRootOptions';

const pulsarOptionsSymbol: symbol = Symbol.for('pulsarOptions');

@Module({})
export class PulsarModule {
  public static forRootAsync(options: PulsarModuleRootOptions): DynamicModule {
    return {
      exports: [pulsarClientSymbol],
      global: true,
      imports: [...(options.imports ?? [])],
      module: PulsarModule,
      providers: [
        {
          inject: options.inject ?? [],
          provide: pulsarOptionsSymbol,
          useFactory: options.useFactory,
        },
        {
          inject: [pulsarOptionsSymbol],
          provide: pulsarClientSymbol,
          useFactory: (options: PulsarClientOptions): Client =>
            new Client({
              serviceUrl: options.serviceUrl,
            }),
        },
      ],
    };
  }
}
