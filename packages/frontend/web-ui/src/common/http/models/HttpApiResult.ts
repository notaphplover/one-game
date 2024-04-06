import { HttpClient } from '@cornie-js/api-http-client';

export type HttpApiResult<TEndpoint extends keyof HttpClient> = Awaited<
  ReturnType<HttpClient[TEndpoint]>
>;
