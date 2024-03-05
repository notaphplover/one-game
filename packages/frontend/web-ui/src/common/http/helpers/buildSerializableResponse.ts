import { Response } from '@cornie-js/api-http-client';

export interface SerializableResponse<
  TBody,
  TStatusCode extends number = number,
> {
  body: TBody;
  statusCode: TStatusCode;
}

export function buildSerializableResponse<
  THeaders extends Record<string, string>,
  TBody,
  TStatusCode extends number,
>(
  response: Response<THeaders, TBody, TStatusCode>,
): SerializableResponse<TBody, TStatusCode> {
  return {
    body: response.body,
    statusCode: response.statusCode,
  };
}
