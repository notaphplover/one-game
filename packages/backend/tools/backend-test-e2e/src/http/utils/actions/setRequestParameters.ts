import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld, RequestMap } from '../../models/OneGameApiWorld';

export function setRequestParameters<TEndpoint extends keyof HttpClient>(
  this: OneGameApiWorld,
  endpoint: TEndpoint,
  alias: string,
  parameters: Parameters<HttpClient[TEndpoint]>,
): void {
  let endpointRequestParametersMap: RequestMap[TEndpoint] =
    this.requestParameters[endpoint];

  if (endpointRequestParametersMap === undefined) {
    endpointRequestParametersMap = {};

    this.requestParameters[endpoint] = endpointRequestParametersMap;
  }

  endpointRequestParametersMap[alias] = parameters;
}
