import { pulsarClientSymbol } from '@cornie-js/backend-adapter-pulsar';
import { gameTurnEndSignalMessageSendOutputPortSymbol } from '@cornie-js/backend-game-application/games';
import { DynamicModule, Module } from '@nestjs/common';
import { Client, Consumer, Producer } from 'pulsar-client';

import { EnvironmentService } from '../../../../../../backend-app-game-env/lib';
import { GameTurnEndSignalMessageSendPulsarAdapter } from '../../pulsar/adapters/GameTurnEndSignalMessageSendPulsarAdapter';
import { GameTurnEndSignalMessageConsumer } from '../../pulsar/consumers/GameTurnEndSignalMessageConsumer';
import { GamePulsarModuleOptions } from '../models/GamePulsarModuleRootOptions';
import { gameTurnEndSignalConsumerSymbol } from '../models/gameTurnEndSignalConsumerSymbol';
import { gameTurnEndSignalProducerSymbol } from '../models/gameTurnEndSignalProducerSymbol';

@Module({})
export class GamePulsarModule {
  public static forConsumersAsync(
    options: GamePulsarModuleOptions,
  ): DynamicModule {
    return {
      exports: [GameTurnEndSignalMessageConsumer],
      global: false,
      imports: [...(options.imports ?? [])],
      module: GamePulsarModule,
      providers: [
        {
          inject: [EnvironmentService, pulsarClientSymbol],
          provide: gameTurnEndSignalConsumerSymbol,
          useFactory: async (
            environmentService: EnvironmentService,
            client: Client,
          ): Promise<Consumer> => {
            const topic: string =
              environmentService.getEnvironment().pulsarGameTurnSignalTopicUrl;

            return client.subscribe({
              subscription: `subscription-${topic}`,
              subscriptionType: 'Shared',
              topic,
            });
          },
        },
        GameTurnEndSignalMessageConsumer,
      ],
    };
  }

  public static forProducersAsync(
    options: GamePulsarModuleOptions,
  ): DynamicModule {
    return {
      exports: [gameTurnEndSignalMessageSendOutputPortSymbol],
      global: false,
      imports: [...(options.imports ?? [])],
      module: GamePulsarModule,
      providers: [
        {
          inject: [EnvironmentService, pulsarClientSymbol],
          provide: gameTurnEndSignalProducerSymbol,
          useFactory: async (
            environmentService: EnvironmentService,
            client: Client,
          ): Promise<Producer> => {
            return client.createProducer({
              topic:
                environmentService.getEnvironment()
                  .pulsarGameTurnSignalTopicUrl,
            });
          },
        },
        {
          provide: gameTurnEndSignalMessageSendOutputPortSymbol,
          useClass: GameTurnEndSignalMessageSendPulsarAdapter,
        },
      ],
    };
  }
}
