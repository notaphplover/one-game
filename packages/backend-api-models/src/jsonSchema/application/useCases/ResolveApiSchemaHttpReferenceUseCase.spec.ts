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
    let resolveApiSchemaHttpReferenceQueryFixture: ResolveApiSchemaHttpReferenceQuery;

    beforeAll(() => {
      resolveApiSchemaHttpReferenceQueryFixture = {
        callback: jest.fn(),
        schemasRootDirectory: '/root/directory',
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
          resolveApiSchemaHttpReferenceQueryFixture.schemasRootDirectory,
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
  });
});
