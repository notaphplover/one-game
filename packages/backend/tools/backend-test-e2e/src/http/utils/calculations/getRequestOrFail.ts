import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld, RequestMap } from '../../models/OneGameApiWorld';

export function getRequestParametersOrFail<TEndpoint extends keyof HttpClient>(
  world: OneGameApiWorld,
  endpoint: TEndpoint,
  alias: string,
): Parameters<HttpClient[TEndpoint]> {
  const endpointRequestParametersMap: RequestMap[TEndpoint] =
    world.requestParameters[endpoint];

  if (endpointRequestParametersMap === undefined) {
    throw new Error(
      `Expected endpoint "${endpoint}" requests to exist in the world`,
    );
  }

  const requestParameters: Parameters<HttpClient[TEndpoint]> | undefined =
    endpointRequestParametersMap[alias];

  if (requestParameters === undefined) {
    throw new Error(`Expected request "${alias}" to exist in the world`);
  }

  return requestParameters;
}
