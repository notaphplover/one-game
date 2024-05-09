import { Response } from '@cornie-js/api-http-client';

import { SerializableResponseUnion } from '../models/SerializableResponseUnion';

export function buildSerializableResponse<
  TBody,
  TStatusCode extends number,
  TResponse extends Response<Record<string, string>, TBody, TStatusCode>,
>(response: TResponse): SerializableResponseUnion<TResponse> {
  return {
    body: response.body,
    statusCode: response.statusCode,
  } as SerializableResponseUnion<TResponse>;
}
