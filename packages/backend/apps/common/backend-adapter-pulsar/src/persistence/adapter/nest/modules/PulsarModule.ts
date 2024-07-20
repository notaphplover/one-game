import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Client, Consumer } from 'pulsar-client';

import { PulsarClientOptions } from '../../pulsar/models/PulsarClientOptions';
import { pulsarClientSymbol } from '../models/pulsarClientSymbol';
import { pulsarConsumersMapSymbol } from '../models/pulsarConsumersMapSymbol';
import { PulsarModuleRootOptions } from '../models/PulsarModuleRootOptions';

const pulsarOptionsSymbol: symbol = Symbol.for('pulsarOptions');

function provideConsumers(
  options: PulsarModuleRootOptions,
  moduleExports: symbol[],
  moduleProviders: Provider[],
): void {
  if (options.provide.consumers) {
    moduleProviders.push({
      inject: [pulsarOptionsSymbol, pulsarClientSymbol],
      provide: pulsarConsumersMapSymbol,
      useFactory: async (
        options: PulsarClientOptions,
        client: Client,
      ): Promise<Map<string, Consumer>> =>
        new Map(
          await Promise.all(
            options.topics.map(
              async (topic: string): Promise<[string, Consumer]> => [
                topic,
                await client.subscribe({
                  subscription: `subscription-${topic}`,
                  subscriptionType: 'Shared',
                  topic,
                }),
              ],
            ),
          ),
        ),
    });

    moduleExports.push(pulsarConsumersMapSymbol);
  }
}

@Module({})
export class PulsarModule {
  public static forRootAsync(options: PulsarModuleRootOptions): DynamicModule {
    const moduleExports: symbol[] = [pulsarClientSymbol];

    const moduleProviders: Provider[] = [
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
    ];

    provideConsumers(options, moduleExports, moduleProviders);

    return {
      exports: moduleExports,
      global: true,
      imports: [...(options.imports ?? [])],
      module: PulsarModule,
      providers: moduleProviders,
    };
  }
}
