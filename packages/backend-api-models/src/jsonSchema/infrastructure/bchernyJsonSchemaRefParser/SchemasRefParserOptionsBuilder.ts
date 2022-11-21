import { FileInfo, Options } from '@bcherny/json-schema-ref-parser';
import { Builder, UseCase } from '@one-game-js/backend-common';

import { API_SCHEMA_HOST } from '../../application/models/apiSchemaHost';
import { ResolveApiSchemaHttpReferenceQuery } from '../../application/queries/ResolveApiSchemaHttpReferenceQuery';

export class SchemasRefParserOptionsBuilder
  implements Builder<Options, [string]>
{
  readonly #resolveApiSchemaHttpReferenceUseCase: UseCase<
    ResolveApiSchemaHttpReferenceQuery,
    Buffer
  >;

  constructor(
    resolveApiSchemaHttpReferenceUseCase: UseCase<
      ResolveApiSchemaHttpReferenceQuery,
      Buffer
    >,
  ) {
    this.#resolveApiSchemaHttpReferenceUseCase =
      resolveApiSchemaHttpReferenceUseCase;
  }

  public build(schemasRootDirectory: string): Options {
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
                referenceHostToSchemasRootDirectoryMap: new Map([
                  [API_SCHEMA_HOST, schemasRootDirectory],
                ]),
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
