import { FileInfo, Options } from '@bcherny/json-schema-ref-parser';

import { ResolveApiSchemaHttpReferenceQuery } from '../../application/queries/ResolveApiSchemaHttpReferenceQuery';
import { ResolveApiSchemaHttpReferenceUseCase } from '../../application/useCases/ResolveApiSchemaHttpReferenceUseCase';

export class SchemasRefParserOptionsBuilder {
  readonly #resolveApiSchemaHttpReferenceUseCase: ResolveApiSchemaHttpReferenceUseCase;

  constructor(
    resolveApiSchemaHttpReferenceUseCase: ResolveApiSchemaHttpReferenceUseCase,
  ) {
    this.#resolveApiSchemaHttpReferenceUseCase =
      resolveApiSchemaHttpReferenceUseCase;
  }

  public build(): Options {
    const schemasRefParserOptions: Options = {
      resolve: {
        http: {
          read: async (
            file: FileInfo,
            callback?: (error: Error | null, data: string | null) => unknown,
          ): Promise<Buffer> => {
            const resolveApiSchemaHttpReferenceQuery: ResolveApiSchemaHttpReferenceQuery =
              {
                callback,
                url: file.url,
              };

            const fileContentBuffer: Buffer =
              await this.#resolveApiSchemaHttpReferenceUseCase.handle(
                resolveApiSchemaHttpReferenceQuery,
              );

            return fileContentBuffer;
          },
        },
      },
    };

    return schemasRefParserOptions;
  }
}
