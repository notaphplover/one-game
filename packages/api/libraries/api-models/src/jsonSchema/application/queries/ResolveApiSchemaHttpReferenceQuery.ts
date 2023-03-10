export interface ResolveApiSchemaHttpReferenceQuery {
  callback?:
    | ((error: Error | null, data: string | null) => unknown)
    | undefined;
  url: string;
}
