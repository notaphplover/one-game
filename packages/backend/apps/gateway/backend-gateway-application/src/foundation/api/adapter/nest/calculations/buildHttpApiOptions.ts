import { EnvironmentService, EnvModule } from '@cornie-js/backend-gateway-env';

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
