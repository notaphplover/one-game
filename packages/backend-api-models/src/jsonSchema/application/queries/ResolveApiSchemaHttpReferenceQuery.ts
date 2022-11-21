export interface ResolveApiSchemaHttpReferenceQuery {
  callback?:
    | ((error: Error | null, data: string | null) => unknown)
    | undefined;
  referenceHostToSchemasRootDirectoryMap: Map<string, string>;
  url: string;
}
