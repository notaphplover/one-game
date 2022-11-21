import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import stream from 'node:stream';

import { UseCase } from '@one-game-js/backend-common';

import { ResolveApiSchemaHttpReferenceQuery } from '../queries/ResolveApiSchemaHttpReferenceQuery';

export class ResolveApiSchemaHttpReferenceUseCase
  implements UseCase<ResolveApiSchemaHttpReferenceQuery, Buffer>
{
  public async handle(
    resolveApiSchemaHttpReferenceQuery: ResolveApiSchemaHttpReferenceQuery,
  ): Promise<Buffer> {
    try {
      let fileContentBuffer: Buffer;

      const filePath: string | undefined = this.#tryGetFilePath(
        resolveApiSchemaHttpReferenceQuery.referenceHostToSchemasRootDirectoryMap,
        resolveApiSchemaHttpReferenceQuery.url,
      );

      if (filePath === undefined) {
        fileContentBuffer = await this.#defaultHandleRemoteRef(
          resolveApiSchemaHttpReferenceQuery.url,
        );
      } else {
        fileContentBuffer = await fs.readFile(filePath);
      }

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

  async #defaultHandleRemoteRef(url: string): Promise<Buffer> {
    return this.#fetch(url);
  }

  async #fetch(url: string): Promise<Buffer> {
    return new Promise(
      (resolve: (buffer: Buffer | Promise<Buffer>) => void) => {
        http.request(url, (response: http.IncomingMessage): void => {
          resolve(this.#toBuffer(response));
        });
      },
    );
  }

  async #toBuffer(readableStream: stream.Readable): Promise<Buffer> {
    return new Promise(
      (resolve: (buffer: Buffer) => void, reject: (err: unknown) => void) => {
        const bufs: Buffer[] = [];

        readableStream.on('data', function (chunk: unknown) {
          if (Buffer.isBuffer(chunk)) {
            bufs.push(chunk);
          } else {
            if (typeof chunk === 'string') {
              bufs.push(Buffer.from(chunk));
            } else {
              reject('Unable to process chunk!');
            }
          }
        });
        readableStream.on('end', function () {
          resolve(Buffer.concat(bufs));
        });
      },
    );
  }

  #tryGetFilePath(
    referenceHostToSchemasRootDirectoryMap: Map<string, string>,
    url: string,
  ): string | undefined {
    const urlObject: URL = new URL(url);

    const urlHost: string = urlObject.hostname;

    const urlPathName: string = urlObject.pathname;

    const schemasRootDirectory: string | undefined =
      referenceHostToSchemasRootDirectoryMap.get(urlHost);

    let filePath: string | undefined;

    if (schemasRootDirectory === undefined) {
      filePath = undefined;
    } else {
      filePath = path.join(schemasRootDirectory, ...urlPathName.split('/'));
    }

    return filePath;
  }
}
