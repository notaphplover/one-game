import fs from 'node:fs/promises';
import path from 'node:path';

import { UseCase } from '@one-game-js/backend-common';

import { ResolveApiSchemaHttpReferenceQuery } from '../queries/ResolveApiSchemaHttpReferenceQuery';

export class ResolveApiSchemaHttpReferenceUseCase
  implements UseCase<ResolveApiSchemaHttpReferenceQuery, Buffer>
{
  public async handle(
    resolveApiSchemaHttpReferenceQuery: ResolveApiSchemaHttpReferenceQuery,
  ): Promise<Buffer> {
    try {
      const urlObject: URL = new URL(resolveApiSchemaHttpReferenceQuery.url);

      const urlPathName: string = urlObject.pathname;

      const filePath: string = path.join(
        resolveApiSchemaHttpReferenceQuery.schemasRootDirectory,
        ...urlPathName.split('/'),
      );

      const fileContentBuffer: Buffer = await fs.readFile(filePath);

      if (resolveApiSchemaHttpReferenceQuery.callback !== undefined) {
        resolveApiSchemaHttpReferenceQuery.callback(
          null,
          fileContentBuffer.toString(),
        );
      }

      return fileContentBuffer;
    } catch (error: unknown) {
      if (resolveApiSchemaHttpReferenceQuery.callback !== undefined) {
        resolveApiSchemaHttpReferenceQuery.callback(error as Error, null);
      }

      throw error;
    }
  }
}
