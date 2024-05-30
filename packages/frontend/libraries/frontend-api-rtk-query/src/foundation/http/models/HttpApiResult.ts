import { HttpClientEndpoints } from '@cornie-js/api-http-client';

export type HttpApiResult<TEndpoint extends keyof HttpClientEndpoints> =
  Awaited<ReturnType<HttpClientEndpoints[TEndpoint]>>;
