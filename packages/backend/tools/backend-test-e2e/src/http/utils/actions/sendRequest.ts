import { HttpClientEndpoints } from '@cornie-js/api-http-client';

import { defaultAlias } from '../../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../models/OneGameApiWorld';
import { getRequestParametersOrFail } from '../calculations/getRequestOrFail';
import { setPendingResponse } from './setPendingResponse';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export async function sendRequest<TEndpoint extends keyof HttpClientEndpoints>(
  this: OneGameApiWorld,
  endpoint: TEndpoint,
  requestAlias: string | undefined,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  const request: Parameters<HttpClientEndpoints[TEndpoint]> =
    getRequestParametersOrFail(this, endpoint, alias);

  const responsePromise: ReturnType<HttpClientEndpoints[TEndpoint]> = (
    this.httpClient.endpoints[endpoint] as (
      ...params: Parameters<HttpClientEndpoints[TEndpoint]>
    ) => ReturnType<HttpClientEndpoints[TEndpoint]>
  )(...request);

  const response: Awaited<ReturnType<HttpClientEndpoints[TEndpoint]>> =
    await responsePromise;

  setPendingResponse.bind(this)(endpoint, alias, response);
}
