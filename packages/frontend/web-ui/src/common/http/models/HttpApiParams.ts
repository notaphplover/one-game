import { HttpClient } from '@cornie-js/api-http-client';

export type HttpApiParams<TEndpoint extends keyof HttpClient> = Parameters<
  HttpClient[TEndpoint]
>;
