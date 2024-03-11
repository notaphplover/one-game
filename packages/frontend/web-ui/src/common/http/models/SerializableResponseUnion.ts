import { Response } from '@cornie-js/api-http-client';
import { SerializableResponse } from './SerializedResponse';

export type SerializableResponseUnion<T> = T extends
  | Response<Record<string, string>, infer TBody, infer TStatusCode>
  | Response<Record<string, string>, infer TBody2, infer TStatusCode2>
  ?
      | SerializableResponse<TBody, TStatusCode>
      | SerializableResponse<TBody2, TStatusCode2>
  : never;
