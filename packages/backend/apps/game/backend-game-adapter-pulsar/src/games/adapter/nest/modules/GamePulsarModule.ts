import { pulsarClientSymbol } from '@cornie-js/backend-adapter-pulsar';
import { gameTurnEndSignalMessageSendOutputPortSymbol } from '@cornie-js/backend-game-application/games';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Client, Producer } from 'pulsar-client';

import { EnvironmentService } from '../../../../../../backend-app-game-env/lib';
import { GameTurnEndSignalMessageSendPulsarAdapter } from '../../pulsar/adapters/GameTurnEndSignalMessageSendPulsarAdapter';
import { GamePulsarModuleRootOptions } from '../models/GamePulsarModuleRootOptions';
import { gameTurnEndSignalProducerSymbol } from '../models/gameTurnEndSignalProducerSymbol';

@Module({})
export class GamePulsarModule {
  public static forRootAsync(
    options: GamePulsarModuleRootOptions,
  ): DynamicModule {
    const moduleExports: symbol[] = [];
    const moduleProviders: Provider[] = [];

    if (options.provide.producers) {
      moduleProviders.push({
        inject: [EnvironmentService, pulsarClientSymbol],
        provide: gameTurnEndSignalProducerSymbol,
        useFactory: async (
          environmentService: EnvironmentService,
          client: Client,
        ): Promise<Producer> => {
          return client.createProducer({
            topic:
              environmentService.getEnvironment().pulsarGameTurnSignalTopicUrl,
          });
        },
      });

      moduleProviders.push({
        provide: gameTurnEndSignalMessageSendOutputPortSymbol,
        useClass: GameTurnEndSignalMessageSendPulsarAdapter,
      });

      moduleExports.push(gameTurnEndSignalMessageSendOutputPortSymbol);
    }

    return {
      exports: moduleExports,
      global: false,
      imports: [...(options.imports ?? [])],
      module: GamePulsarModule,
      providers: moduleProviders,
    };
  }
}
