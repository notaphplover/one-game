import {
  PulsarClientOptions,
  PulsarModule,
} from '@cornie-js/backend-adapter-pulsar';
import {
  Environment,
  EnvironmentService,
  EnvModule,
} from '@cornie-js/backend-app-game-env';
import { GamePulsarModuleOptions } from '@cornie-js/backend-game-adapter-pulsar';

export function buildGamePulsarModuleOptions(): GamePulsarModuleOptions {
  return {
    imports: [
      EnvModule,
      PulsarModule.forRootAsync({
        imports: [EnvModule],
        inject: [EnvironmentService],
        useFactory: (
          environmentService: EnvironmentService,
        ): PulsarClientOptions => {
          const env: Environment = environmentService.getEnvironment();

          return {
            serviceUrl: env.pulsarServiceUrl,
          };
        },
      }),
    ],
  };
}
