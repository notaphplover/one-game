import * as ApiHttpClient from '@cornie-js/api-http-client';

import { environmentService } from '../../env/services/EnvironmentService';

export const httpClient = new ApiHttpClient.HttpClient(
  environmentService.getEnvironment().backendBaseUrl,
);
