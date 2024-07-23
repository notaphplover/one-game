import {
  PulsarClientOptions,
  PulsarModule,
} from '@cornie-js/backend-adapter-pulsar';
import {
  Environment,
  EnvironmentService,
  EnvModule,
} from '@cornie-js/backend-app-game-env';
import { GameIoredisModule } from '@cornie-js/backend-game-adapter-ioredis';
import { GamePulsarModule } from '@cornie-js/backend-game-adapter-pulsar';
import {
  DbModule,
  GameDbModule,
  GameSnapshotDbModule,
  GameActionDbModule,
} from '@cornie-js/backend-game-adapter-typeorm';
import { GameApplicationModule } from '@cornie-js/backend-game-application';
import { DynamicModule, Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { buildIoredisModuleOptions } from '../../../../foundation/redis/adapter/ioredis/calculations/buildIoredisModuleOptions';
import { StatusHttpApiModule } from '../../../../status/adapter/nest/modules/StatusHttpApiModule';

const gameDbModule: DynamicModule = GameDbModule.forRootAsync(
  buildDbModuleOptions(),
);

const pulsarModule: DynamicModule = PulsarModule.forRootAsync({
  imports: [EnvModule],
  inject: [EnvironmentService],
  useFactory: (environmentService: EnvironmentService): PulsarClientOptions => {
    const env: Environment = environmentService.getEnvironment();

    return {
      serviceUrl: env.pulsarServiceUrl,
    };
  },
});

@Module({
  imports: [
    GamePulsarModule.forConsumersAsync({
      imports: [
        EnvModule,
        GameApplicationModule.forRootAsync([
          DbModule.forTransaction(),
          GameActionDbModule.forRootAsync(buildDbModuleOptions()),
          gameDbModule,
          GameIoredisModule.forRootAsync(buildIoredisModuleOptions()),
          GamePulsarModule.forProducersAsync({
            imports: [EnvModule, pulsarModule],
          }),
          GameSnapshotDbModule.forRootAsync(buildDbModuleOptions()),
        ]),
        gameDbModule,
        pulsarModule,
      ],
    }),
    StatusHttpApiModule,
  ],
})
export class AppModule {}
