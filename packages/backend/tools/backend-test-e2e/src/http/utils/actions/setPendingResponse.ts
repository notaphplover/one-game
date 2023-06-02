import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld, ResponseMap } from '../../models/OneGameApiWorld';

export function setPendingResponse<TEndpoint extends keyof HttpClient>(
  world: OneGameApiWorld,
  endpoint: TEndpoint,
  alias: string,
  response: ReturnType<HttpClient[TEndpoint]>,
): void {
  let endpointResponsesMap: ResponseMap[TEndpoint] =
    world.pendingResponses[endpoint];

  if (endpointResponsesMap === undefined) {
    endpointResponsesMap = {};

    world.pendingResponses[endpoint] = endpointResponsesMap;
  }

  endpointResponsesMap[alias] = response;
}
