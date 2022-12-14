import { FileInfo, Options } from '@bcherny/json-schema-ref-parser';
import { Builder, UseCase } from '@one-game-js/backend-common';

import { ResolveApiSchemaHttpReferenceQuery } from '../../application/queries/ResolveApiSchemaHttpReferenceQuery';

export class SchemasRefParserOptionsBuilder implements Builder<Options> {
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
