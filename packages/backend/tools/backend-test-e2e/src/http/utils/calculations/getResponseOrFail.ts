import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld, ResponseMap } from '../../models/OneGameApiWorld';

export function getResponseParametersOrFail<TEndpoint extends keyof HttpClient>(
  world: OneGameApiWorld,
  endpoint: TEndpoint,
  alias: string,
): ReturnType<HttpClient[TEndpoint]> {
  const endpointPendingResponsesMap: ResponseMap[TEndpoint] =
    world.pendingResponses[endpoint];

  if (endpointPendingResponsesMap === undefined) {
    throw new Error(
      `Expected endpoint "${endpoint}" responses to exist in the world`,
    );
  }

  const pendingResponse: ReturnType<HttpClient[TEndpoint]> | undefined =
    endpointPendingResponsesMap[alias];

  if (pendingResponse === undefined) {
    throw new Error(`Expected response "${alias}" to exist in the world`);
  }

  return pendingResponse;
}
