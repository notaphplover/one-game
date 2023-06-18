import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-game-env';

import { HttpApiModuleOptions } from '../../../application/models/HttpApiModuleOptions';
import { HttpApiOptions } from '../../../application/models/HttpApiOptions';

export function buildHttpApiModuleOptions(): HttpApiModuleOptions {
  return {
    imports: [EnvModule],
    inject: [EnvironmentService],
    useFactory: (environmentService: EnvironmentService): HttpApiOptions => ({
      baseUrl: environmentService.getEnvironment().apiBaseUrl,
    }),
  };
}
