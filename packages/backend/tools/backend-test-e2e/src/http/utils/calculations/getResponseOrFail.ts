import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld, ResponseMap } from '../../models/OneGameApiWorld';

export function getResponseParametersOrFail<TEndpoint extends keyof HttpClient>(
  world: OneGameApiWorld,
  endpoint: TEndpoint,
  alias: string,
): Awaited<ReturnType<HttpClient[TEndpoint]>> {
  const endpointResponsesMap: ResponseMap[TEndpoint] =
    world.responses[endpoint];

  if (endpointResponsesMap === undefined) {
    throw new Error(
      `Expected endpoint "${endpoint}" responses to exist in the world`,
    );
  }

  const pendingResponse:
    | Awaited<ReturnType<HttpClient[TEndpoint]>>
    | undefined = endpointResponsesMap[alias];

  if (pendingResponse === undefined) {
    throw new Error(`Expected response "${alias}" to exist in the world`);
  }

  return pendingResponse;
}
