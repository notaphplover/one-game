import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld } from '../../models/OneGameApiWorld';

export function initializeWorld(
  world: Partial<OneGameApiWorld>,
  baseUrl: string,
): void {
  world.httpClient = new HttpClient(baseUrl);
  world.requestParameters = {};
  world.pendingResponses = {};
}
