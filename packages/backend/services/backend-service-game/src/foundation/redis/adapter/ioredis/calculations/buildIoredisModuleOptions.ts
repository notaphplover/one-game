import {
  EnvModule,
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-game-env';
import { PubSubIoredisModuleOptions } from '@cornie-js/backend-game-adapter-ioredis';

export function buildIoredisModuleOptions(): PubSubIoredisModuleOptions {
  return {
    imports: [EnvModule],
    inject: [EnvironmentService],
    useFactory: (environmentService: EnvironmentService) => {
      const environment: Environment = environmentService.getEnvironment();

      return {
        host: environment.pubSubRedisHost,
        port: environment.pubSubRedisPort,
      };
    },
  };
}
