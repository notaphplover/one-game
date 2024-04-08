import { Response } from '@cornie-js/api-http-client';

export type HttpSpecificResponse<TResponse, TStatusCode extends number> =
  TResponse extends Response<infer THeaders, infer TBody, TStatusCode>
    ? Response<THeaders, TBody, TStatusCode>
    : never;
