import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('node:http');

import http from 'node:http';
import stream from 'node:stream';

import { ResolveApiSchemaHttpReferenceQuery } from '../queries/ResolveApiSchemaHttpReferenceQuery';
import { ResolveApiSchemaHttpReferenceUseCase } from './ResolveApiSchemaHttpReferenceUseCase';

describe(ResolveApiSchemaHttpReferenceUseCase.name, () => {
  describe('.handle', () => {
    describe('having a ResolveApiSchemaHttpReferenceQuery', () => {
      let resolveApiSchemaHttpReferenceQueryFixture: ResolveApiSchemaHttpReferenceQuery;

      beforeAll(() => {
        resolveApiSchemaHttpReferenceQueryFixture = {
          callback: jest.fn(),
          url: 'https://sample.com/root/directory/schema/path',
        };
      });

      describe('when called', () => {
        let resolveApiSchemaHttpReferenceUseCase: ResolveApiSchemaHttpReferenceUseCase;

        let result: unknown;

        let fileContentBufferFixture: Buffer;
        let fileContentFixture: string;

        beforeAll(async () => {
          resolveApiSchemaHttpReferenceUseCase =
            new ResolveApiSchemaHttpReferenceUseCase(new Map());

          fileContentFixture = 'file content fixture';
          fileContentBufferFixture = Buffer.from(fileContentFixture);

          (
            http.request as jest.Mock<typeof http.request>
          ).mockImplementationOnce(
            (
              _: unknown,
              optionsOrcallback?:
                | ((response: http.IncomingMessage) => void)
                | http.RequestOptions,
            ): http.ClientRequest => {
              if (typeof optionsOrcallback === 'function') {
                const readableStream: stream.Readable = stream.Readable.from([
                  fileContentBufferFixture,
                ]);

                optionsOrcallback(readableStream as http.IncomingMessage);
              }

              return {} as Partial<http.ClientRequest> as http.ClientRequest;
            },
          );

          result = await resolveApiSchemaHttpReferenceUseCase.handle(
            resolveApiSchemaHttpReferenceQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call http.request()', () => {
          expect(http.request).toHaveBeenCalledTimes(1);
          expect(http.request).toHaveBeenCalledWith(
            resolveApiSchemaHttpReferenceQueryFixture.url,
            expect.any(Function),
          );
        });

        it('should return a buffer', () => {
          expect(result).toStrictEqual(fileContentBufferFixture);
          expect(result).toStrictEqual(Buffer.from(fileContentFixture));
        });
      });
    });

    describe('having a ResolveApiSchemaHttpReferenceQuery with url matching map', () => {
      let resolveApiSchemaHttpReferenceQueryFixture: ResolveApiSchemaHttpReferenceQuery;

      beforeAll(() => {
        resolveApiSchemaHttpReferenceQueryFixture = {
          url: 'https://sample.com/root/directory/schema/path',
        };
      });

      describe('when called', () => {
        let resolveApiSchemaHttpReferenceUseCase: ResolveApiSchemaHttpReferenceUseCase;

        let result: unknown;

        let fileContentBufferFixture: Buffer;
        let fileContentFixture: string;

        beforeAll(async () => {
          fileContentFixture = 'file content fixture';
          fileContentBufferFixture = Buffer.from(fileContentFixture);

          resolveApiSchemaHttpReferenceUseCase =
            new ResolveApiSchemaHttpReferenceUseCase(
              new Map([
                [
                  resolveApiSchemaHttpReferenceQueryFixture.url,
                  fileContentBufferFixture,
                ],
              ]),
            );

          result = await resolveApiSchemaHttpReferenceUseCase.handle(
            resolveApiSchemaHttpReferenceQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a buffer', () => {
          expect(result).toBe(fileContentBufferFixture);
        });
      });
    });

    describe('having a ResolveApiSchemaHttpReferenceQuery with a callback and url matching map', () => {
      let resolveApiSchemaHttpReferenceQueryFixture: ResolveApiSchemaHttpReferenceQuery;

      beforeAll(() => {
        resolveApiSchemaHttpReferenceQueryFixture = {
          callback: jest.fn(),
          url: 'https://sample.com/root/directory/schema/path',
        };
      });

      describe('when called', () => {
        let resolveApiSchemaHttpReferenceUseCase: ResolveApiSchemaHttpReferenceUseCase;

        let result: unknown;

        let fileContentBufferFixture: Buffer;
        let fileContentFixture: string;

        beforeAll(async () => {
          fileContentFixture = 'file content fixture';
          fileContentBufferFixture = Buffer.from(fileContentFixture);

          resolveApiSchemaHttpReferenceUseCase =
            new ResolveApiSchemaHttpReferenceUseCase(
              new Map([
                [
                  resolveApiSchemaHttpReferenceQueryFixture.url,
                  fileContentBufferFixture,
                ],
              ]),
            );

          result = await resolveApiSchemaHttpReferenceUseCase.handle(
            resolveApiSchemaHttpReferenceQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call resolveApiSchemaHttpReferenceQuery.callback()', () => {
          expect(
            resolveApiSchemaHttpReferenceQueryFixture.callback,
          ).toHaveBeenCalledTimes(1);
          expect(
            resolveApiSchemaHttpReferenceQueryFixture.callback,
          ).toHaveBeenCalledWith(null, fileContentFixture);
        });

        it('should return a buffer', () => {
          expect(result).toBe(fileContentBufferFixture);
          expect(result).toStrictEqual(Buffer.from(fileContentFixture));
        });
      });
    });
  });
});
