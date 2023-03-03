import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  FileInfo,
  HTTPResolverOptions,
  Options,
  ResolverOptions,
} from '@bcherny/json-schema-ref-parser';
import { Handler } from '@one-game-js/backend-common';

import { ResolveApiSchemaHttpReferenceQuery } from '../../application/queries/ResolveApiSchemaHttpReferenceQuery';
import { SchemasRefParserOptionsBuilder } from './SchemasRefParserOptionsBuilder';

describe(SchemasRefParserOptionsBuilder.name, () => {
  let resolveApiSchemaHttpReferenceUseCaseMock: jest.Mocked<
    Handler<[ResolveApiSchemaHttpReferenceQuery], Buffer>
  >;

  let schemasRefParserOptionsBuilder: SchemasRefParserOptionsBuilder;

  beforeAll(() => {
    resolveApiSchemaHttpReferenceUseCaseMock = {
      handle: jest.fn(),
    };

    schemasRefParserOptionsBuilder = new SchemasRefParserOptionsBuilder(
      resolveApiSchemaHttpReferenceUseCaseMock,
    );
  });

  describe('.build', () => {
    describe('having a schemasRootDirectory', () => {
      describe('when called', () => {
        let result: unknown;
        let resultAsOptions: Options;

        beforeAll(() => {
          result = schemasRefParserOptionsBuilder.build();
          resultAsOptions = result as Options;
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return options', () => {
          const optionsResolveExpectations: Partial<Options['resolve']> = {
            http: {
              read: expect.any(
                Function,
              ) as unknown as HTTPResolverOptions['read'],
            } as HTTPResolverOptions,
          };

          const optionsExpectations: Partial<Options> = {
            resolve: expect.objectContaining(
              optionsResolveExpectations,
            ) as Partial<Options['resolve']> as Options['resolve'],
          } as Partial<Options>;

          expect(result).toStrictEqual(
            expect.objectContaining(optionsExpectations),
          );
        });

        describe.each<
          [
            string,
            () =>
              | ((error: Error | null, data: string | null) => unknown)
              | undefined,
          ]
        >([
          ['an undefined callback', () => undefined],
          ['a callback', () => () => undefined],
        ])(
          'having %s',
          (
            _: string,
            callbackMockBuilder: () =>
              | ((error: Error | null, data: string | null) => unknown)
              | undefined,
          ) => {
            let callbackFixture:
              | ((error: Error | null, data: string | null) => unknown)
              | undefined;

            beforeAll(() => {
              callbackFixture = callbackMockBuilder();
            });

            describe('when called options.read()', () => {
              let fileContentBufferFixture: Buffer;
              let fileContentFixture: string;

              let fileInfoFixture: FileInfo;
              let result: unknown;

              beforeAll(async () => {
                fileContentFixture = 'file content fixture';
                fileContentBufferFixture = Buffer.from(fileContentFixture);

                fileInfoFixture = {
                  url: 'http://file-info.fixture/url',
                } as Partial<FileInfo> as FileInfo;

                const httpResolverOptions: HTTPResolverOptions = resultAsOptions
                  .resolve?.http as HTTPResolverOptions;

                const httpResolverOptionsRead: ResolverOptions['read'] =
                  httpResolverOptions.read as ResolverOptions['read'];

                resolveApiSchemaHttpReferenceUseCaseMock.handle.mockResolvedValueOnce(
                  fileContentBufferFixture,
                );

                if (callbackFixture === undefined) {
                  result = await httpResolverOptionsRead(fileInfoFixture);
                } else {
                  result = await httpResolverOptionsRead(
                    fileInfoFixture,
                    callbackFixture,
                  );
                }
              });

              afterAll(() => {
                jest.clearAllMocks();
              });

              it('should call resolveApiSchemaHttpReferenceUseCase.handle', () => {
                const expectedResolveApiSchemaHttpReferenceQuery: ResolveApiSchemaHttpReferenceQuery =
                  {
                    callback: callbackFixture,
                    url: fileInfoFixture.url,
                  };

                expect(
                  resolveApiSchemaHttpReferenceUseCaseMock.handle,
                ).toHaveBeenCalledTimes(1);
                expect(
                  resolveApiSchemaHttpReferenceUseCaseMock.handle,
                ).toHaveBeenCalledWith(
                  expectedResolveApiSchemaHttpReferenceQuery,
                );
              });

              it('should return a buffer', () => {
                expect(result).toBe(fileContentBufferFixture);
              });
            });
          },
        );
      });
    });
  });
});
