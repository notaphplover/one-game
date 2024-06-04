import { HttpClientEndpoints } from '@cornie-js/api-http-client';

type ArrayWithNoFirstElem<T> = T extends [unknown, ...infer E] ? E : never;

export type HttpApiParamsWithNoHeaders<
  TEndpoint extends keyof HttpClientEndpoints,
> = ArrayWithNoFirstElem<Parameters<HttpClientEndpoints[TEndpoint]>>;
