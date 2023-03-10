import http from 'node:http';
import stream from 'node:stream';

import { ResolveApiSchemaHttpReferenceQuery } from '../queries/ResolveApiSchemaHttpReferenceQuery';

export class ResolveApiSchemaHttpReferenceUseCase {
  readonly #uriToApiSchemaBufferMap: Map<string, Buffer>;

  constructor(uriToJsonSchemaBufferMap: Map<string, Buffer>) {
    this.#uriToApiSchemaBufferMap = uriToJsonSchemaBufferMap;
  }

  public async handle(
    resolveApiSchemaHttpReferenceQuery: ResolveApiSchemaHttpReferenceQuery,
  ): Promise<Buffer> {
    try {
      let fileContentBuffer: Buffer | undefined;

      const apiSchemaBufferOrUndefined: Buffer | undefined =
        this.#uriToApiSchemaBufferMap.get(
          resolveApiSchemaHttpReferenceQuery.url,
        );

      if (apiSchemaBufferOrUndefined === undefined) {
        fileContentBuffer = await this.#defaultHandleRemoteRef(
          resolveApiSchemaHttpReferenceQuery.url,
        );
      } else {
        fileContentBuffer = apiSchemaBufferOrUndefined;
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
        readableStream.on('error', (error: Error) => {
          reject(error);
        });
      },
    );
  }
}
