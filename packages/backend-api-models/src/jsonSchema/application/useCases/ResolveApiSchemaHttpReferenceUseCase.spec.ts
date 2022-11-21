import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('node:fs/promises');
jest.mock('node:path');

// eslint-disable-next-line import/order
import fs from 'node:fs/promises';
// eslint-disable-next-line import/order
import path from 'node:path';

import { ResolveApiSchemaHttpReferenceQuery } from '../queries/ResolveApiSchemaHttpReferenceQuery';
import { ResolveApiSchemaHttpReferenceUseCase } from './ResolveApiSchemaHttpReferenceUseCase';

describe(ResolveApiSchemaHttpReferenceUseCase.name, () => {
  let resolveApiSchemaHttpReferenceUseCase: ResolveApiSchemaHttpReferenceUseCase;

  beforeAll(() => {
    resolveApiSchemaHttpReferenceUseCase =
      new ResolveApiSchemaHttpReferenceUseCase();
  });

  describe('.handle', () => {
    describe('having a ResolveApiSchemaHttpReferenceQuery', () => {
      let schemasRootDirectoryFixture: string;
      let resolveApiSchemaHttpReferenceQueryFixture: ResolveApiSchemaHttpReferenceQuery;

      beforeAll(() => {
        schemasRootDirectoryFixture = '/root/directory';
        resolveApiSchemaHttpReferenceQueryFixture = {
          referenceHostToSchemasRootDirectoryMap: new Map([
            ['sample.com', schemasRootDirectoryFixture],
          ]),
          url: 'https://sample.com/root/directory/schema/path',
        };
      });

      describe('when called', () => {
        let result: unknown;

        let fileContentBufferFixture: Buffer;
        let fileContentFixture: string;
        let filePathFixture: string;

        beforeAll(async () => {
          fileContentFixture = 'file content fixture';
          fileContentBufferFixture = Buffer.from(fileContentFixture);
          filePathFixture = '/file/path/fixture';

          (
            path.join as jestMock.Mock<path.PlatformPath['join']>
          ).mockReturnValueOnce(filePathFixture);

          (
            fs.readFile as jestMock.Mock<fs.FileHandle['readFile']>
          ).mockResolvedValueOnce(fileContentBufferFixture);

          result = await resolveApiSchemaHttpReferenceUseCase.handle(
            resolveApiSchemaHttpReferenceQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call path.join()', () => {
          expect(path.join).toHaveBeenCalledTimes(1);
          expect(path.join).toHaveBeenCalledWith(
            schemasRootDirectoryFixture,
            '',
            'root',
            'directory',
            'schema',
            'path',
          );
        });

        it('should call fs.readFile()', () => {
          expect(fs.readFile).toHaveBeenCalledTimes(1);
          expect(fs.readFile).toHaveBeenCalledWith(filePathFixture);
        });

        it('should return a buffer', () => {
          expect(result).toBe(fileContentBufferFixture);
          expect(result).toStrictEqual(Buffer.from(fileContentFixture));
        });
      });

      describe('when called, and fs.readFile() throws an Error', () => {
        let errorFixture: Error;

        let filePathFixture: string;

        let result: unknown;

        beforeAll(async () => {
          errorFixture = new Error('Error from fs.read()!');
          filePathFixture = '/file/path/fixture';

          (
            path.join as jestMock.Mock<path.PlatformPath['join']>
          ).mockReturnValueOnce(filePathFixture);

          (
            fs.readFile as jestMock.Mock<fs.FileHandle['readFile']>
          ).mockRejectedValueOnce(errorFixture);

          try {
            await resolveApiSchemaHttpReferenceUseCase.handle(
              resolveApiSchemaHttpReferenceQueryFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw and error', () => {
          expect(result).toBe(errorFixture);
        });
      });
    });

    describe('having a ResolveApiSchemaHttpReferenceQuery with a callback', () => {
      let schemasRootDirectoryFixture: string;
      let resolveApiSchemaHttpReferenceQueryFixture: ResolveApiSchemaHttpReferenceQuery;

      beforeAll(() => {
        schemasRootDirectoryFixture = '/root/directory';

        resolveApiSchemaHttpReferenceQueryFixture = {
          callback: jest.fn(),
          referenceHostToSchemasRootDirectoryMap: new Map([
            ['sample.com', schemasRootDirectoryFixture],
          ]),
          url: 'https://sample.com/root/directory/schema/path',
        };
      });

      describe('when called', () => {
        let result: unknown;

        let fileContentBufferFixture: Buffer;
        let fileContentFixture: string;
        let filePathFixture: string;

        beforeAll(async () => {
          fileContentFixture = 'file content fixture';
          fileContentBufferFixture = Buffer.from(fileContentFixture);
          filePathFixture = '/file/path/fixture';

          (
            path.join as jestMock.Mock<path.PlatformPath['join']>
          ).mockReturnValueOnce(filePathFixture);

          (
            fs.readFile as jestMock.Mock<fs.FileHandle['readFile']>
          ).mockResolvedValueOnce(fileContentBufferFixture);

          result = await resolveApiSchemaHttpReferenceUseCase.handle(
            resolveApiSchemaHttpReferenceQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call path.join()', () => {
          expect(path.join).toHaveBeenCalledTimes(1);
          expect(path.join).toHaveBeenCalledWith(
            schemasRootDirectoryFixture,
            '',
            'root',
            'directory',
            'schema',
            'path',
          );
        });

        it('should call fs.readFile()', () => {
          expect(fs.readFile).toHaveBeenCalledTimes(1);
          expect(fs.readFile).toHaveBeenCalledWith(filePathFixture);
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

      describe('when called, and fs.readFile() throws an Error', () => {
        let errorFixture: Error;

        let filePathFixture: string;

        let result: unknown;

        beforeAll(async () => {
          errorFixture = new Error('Error from fs.read()!');
          filePathFixture = '/file/path/fixture';

          (
            path.join as jestMock.Mock<path.PlatformPath['join']>
          ).mockReturnValueOnce(filePathFixture);

          (
            fs.readFile as jestMock.Mock<fs.FileHandle['readFile']>
          ).mockRejectedValueOnce(errorFixture);

          try {
            await resolveApiSchemaHttpReferenceUseCase.handle(
              resolveApiSchemaHttpReferenceQueryFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call callback()', () => {
          expect(
            resolveApiSchemaHttpReferenceQueryFixture.callback,
          ).toHaveBeenCalledTimes(1);
          expect(
            resolveApiSchemaHttpReferenceQueryFixture.callback,
          ).toHaveBeenCalledWith(errorFixture, null);
        });

        it('should throw and error', () => {
          expect(result).toBe(errorFixture);
        });
      });
    });
  });
});
