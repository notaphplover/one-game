export interface Request {
  headers: Record<string, string>;
  query: Record<string, string>;
  urlParameters: Record<string, string>;
}
