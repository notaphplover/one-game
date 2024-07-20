import { PulsarModule } from '@cornie-js/backend-adapter-pulsar';
import { PulsarClientOptions } from '@cornie-js/backend-adapter-pulsar/lib/persistence/adapter/pulsar/models/PulsarClientOptions';
import {
  Environment,
  EnvironmentService,
  EnvModule,
} from '@cornie-js/backend-app-game-env';
import { GamePulsarModuleRootOptions } from '@cornie-js/backend-game-adapter-pulsar';

export function buildGamePulsarModuleRootOptions(): GamePulsarModuleRootOptions {
  return {
    imports: [
      EnvModule,
      PulsarModule.forRootAsync({
        imports: [EnvModule],
        inject: [EnvironmentService],
        provide: {
          consumers: false,
        },
        useFactory: (
          environmentService: EnvironmentService,
        ): PulsarClientOptions => {
          const env: Environment = environmentService.getEnvironment();

          return {
            serviceUrl: env.pulsarServiceUrl,
            topics: [],
          };
        },
      }),
    ],
    provide: {
      consumers: false,
      producers: true,
    },
  };
}
