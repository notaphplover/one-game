export interface SerializableResponse<
  TBody,
  TStatusCode extends number = number,
> {
  body: TBody;
  statusCode: TStatusCode;
}
