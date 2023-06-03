import { HttpClient } from '@cornie-js/api-http-client';

import { UserParameterV1 } from '../../../user/models/UserV1Parameter';
import { OneGameApiWorld } from '../../models/OneGameApiWorld';

export function initializeWorld(
  world: Partial<OneGameApiWorld>,
  baseUrl: string,
): void {
  world.entities = {
    users: new Map<string, UserParameterV1>(),
  };
  world.httpClient = new HttpClient(baseUrl);
  world.requestParameters = {};
  world.pendingResponses = {};
}
