import {
  GameEventsChannelFromGameIdBuilder,
  gameEventsSubscriptionOutputPortSymbol,
} from '@cornie-js/backend-game-application/games';
import { DynamicModule, Module } from '@nestjs/common';

import { PubSubIoredisModuleOptions } from '../../../../foundation/redis/adapter/nest/models/PubSubIoredisModuleOptions';
import { PubSubIoredisModule } from '../../../../foundation/redis/adapter/nest/modules/PubSubIoredisModule';
import { GameEventsSubscriptionIoredisOutputAdapter } from '../../ioredis/adapters/GameEventsSubscriptionIoredisOutputAdapter';
import { GameEventsIoredisSubscriber } from '../../ioredis/subscribers/GameEventsIoredisSubscriber';

@Module({})
export class GameIoredisModule {
  public static forRootAsync(
    options: PubSubIoredisModuleOptions,
  ): DynamicModule {
    return {
      exports: [gameEventsSubscriptionOutputPortSymbol],
      global: false,
      imports: [PubSubIoredisModule.forRootAsync(options)],
      module: GameIoredisModule,
      providers: [
        GameEventsChannelFromGameIdBuilder,
        GameEventsIoredisSubscriber,
        {
          provide: gameEventsSubscriptionOutputPortSymbol,
          useClass: GameEventsSubscriptionIoredisOutputAdapter,
        },
      ],
    };
  }
}
