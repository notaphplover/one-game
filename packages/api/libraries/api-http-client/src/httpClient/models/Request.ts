export interface Request {
  method: string;
  url: string;
  headers: Record<string, string> | undefined;
  queryParams:
    | Record<string, number | number[] | string | string[]>
    | undefined;
  urlParameters: Record<string, string> | undefined;
  body: unknown;
}
