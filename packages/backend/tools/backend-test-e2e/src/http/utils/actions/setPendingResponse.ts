import { HttpClientEndpoints } from '@cornie-js/api-http-client';

import { OneGameApiWorld } from '../../models/OneGameApiWorld';

export function setPendingResponse<TEndpoint extends keyof HttpClientEndpoints>(
  this: OneGameApiWorld,
  endpoint: TEndpoint,
  alias: string,
  response: Awaited<ReturnType<HttpClientEndpoints[TEndpoint]>>,
): void {
  /*
   * ResponseMap[TEndpoint] produces a union type that is too complex to represent.
   * For this reaon, any is used instead
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let endpointResponsesMap: Record<string, any> | undefined =
    this.responses[endpoint];

  if (endpointResponsesMap === undefined) {
    endpointResponsesMap = {};

    this.responses[endpoint] = endpointResponsesMap;
  }

  endpointResponsesMap[alias] = response;
}
