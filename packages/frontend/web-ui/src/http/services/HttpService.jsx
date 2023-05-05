import { HttpClient } from '@cornie-js/api-http-client';

import { environmentService } from '../../env/services/EnvironmentService';

export const httpClient = new HttpClient(environmentService.getEnvironment().backendBaseUrl);

