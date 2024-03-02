import { PubSubIoredisModuleOptions } from '@cornie-js/backend-game-adapter-ioredis';

import { EnvModule } from '../../../../../env/adapter/nest/modules/EnvModule';
import { Environment } from '../../../../../env/application/models/Environment';
import { EnvironmentService } from '../../../../../env/application/services/EnvironmentService';

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
