import { HttpClientEndpoints } from '@cornie-js/api-http-client';

export type HttpApiParams<TEndpoint extends keyof HttpClientEndpoints> =
  Parameters<HttpClientEndpoints[TEndpoint]>;
