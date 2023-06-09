import { HttpClient } from '@cornie-js/api-http-client';

import { defaultAlias } from '../../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../models/OneGameApiWorld';
import { getRequestParametersOrFail } from '../calculations/getRequestOrFail';
import { setPendingResponse } from './setPendingResponse';

export async function sendRequest<TEndpoint extends keyof HttpClient>(
  this: OneGameApiWorld,
  endpoint: TEndpoint,
  requestAlias: string | undefined,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  const request: Parameters<HttpClient[TEndpoint]> = getRequestParametersOrFail(
    this,
    endpoint,
    alias,
  );

  const responsePromise: ReturnType<HttpClient[TEndpoint]> = (
    this.httpClient[endpoint] as (
      ...params: Parameters<HttpClient[TEndpoint]>
    ) => ReturnType<HttpClient[TEndpoint]>
  )(...request);

  const response: Awaited<ReturnType<HttpClient[TEndpoint]>> =
    await responsePromise;

  setPendingResponse.bind(this)(endpoint, alias, response);
}
