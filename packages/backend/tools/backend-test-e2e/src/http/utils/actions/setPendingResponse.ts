import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld, ResponseMap } from '../../models/OneGameApiWorld';

export function setPendingResponse<TEndpoint extends keyof HttpClient>(
  this: OneGameApiWorld,
  endpoint: TEndpoint,
  alias: string,
  response: Awaited<ReturnType<HttpClient[TEndpoint]>>,
): void {
  let endpointResponsesMap: ResponseMap[TEndpoint] = this.responses[endpoint];

  if (endpointResponsesMap === undefined) {
    endpointResponsesMap = {};

    this.responses[endpoint] = endpointResponsesMap;
  }

  endpointResponsesMap[alias] = response;
}
