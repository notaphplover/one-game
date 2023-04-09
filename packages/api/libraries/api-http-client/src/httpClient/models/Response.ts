export interface Response<
  THeaders extends Record<string, string> = Record<string, string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TBody = any,
  TStatusCode extends number = number,
> {
  headers: THeaders;
  body: TBody;
  statusCode: TStatusCode;
}
