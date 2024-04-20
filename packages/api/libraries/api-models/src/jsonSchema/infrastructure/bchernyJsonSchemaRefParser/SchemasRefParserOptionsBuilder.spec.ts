import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  FileInfo,
  HTTPResolverOptions,
  ParserOptions,
} from '@apidevtools/json-schema-ref-parser';

import { ResolveApiSchemaHttpReferenceQuery } from '../../application/queries/ResolveApiSchemaHttpReferenceQuery';
import { ResolveApiSchemaHttpReferenceUseCase } from '../../application/useCases/ResolveApiSchemaHttpReferenceUseCase';
import { SchemasRefParserOptionsBuilder } from './SchemasRefParserOptionsBuilder';

describe(SchemasRefParserOptionsBuilder.name, () => {
  let resolveApiSchemaHttpReferenceUseCaseMock: jest.Mocked<ResolveApiSchemaHttpReferenceUseCase>;

  let schemasRefParserOptionsBuilder: SchemasRefParserOptionsBuilder;

  beforeAll(() => {
    resolveApiSchemaHttpReferenceUseCaseMock = {
      handle: jest.fn(),
    } as Partial<
      jest.Mocked<ResolveApiSchemaHttpReferenceUseCase>
    > as jest.Mocked<ResolveApiSchemaHttpReferenceUseCase>;

    schemasRefParserOptionsBuilder = new SchemasRefParserOptionsBuilder(
      resolveApiSchemaHttpReferenceUseCaseMock,
    );
  });

  describe('.build', () => {
    describe('having a schemasRootDirectory', () => {
      describe('when called', () => {
        let result: unknown;
        let resultAsOptions: ParserOptions;

        beforeAll(() => {
          result = schemasRefParserOptionsBuilder.build();
          resultAsOptions = result as ParserOptions;
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return options', () => {
          const optionsResolveExpectations: Partial<ParserOptions['resolve']> =
            {
              http: {
                read: expect.any(
                  Function,
                ) as unknown as HTTPResolverOptions['read'],
              } as HTTPResolverOptions,
            };

          const optionsExpectations: Partial<ParserOptions> = {
            resolve: expect.objectContaining(
              optionsResolveExpectations,
            ) as Partial<ParserOptions['resolve']> as ParserOptions['resolve'],
          } as Partial<ParserOptions>;

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

                const httpResolverOptionsRead: (
                  file: FileInfo,
                  callback?: (
                    error: Error | null,
                    data: string | null,
                  ) => unknown,
                ) => Promise<Buffer> = httpResolverOptions.read as (
                  file: FileInfo,
                  callback?: (
                    error: Error | null,
                    data: string | null,
                  ) => unknown,
                ) => Promise<Buffer>;

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
