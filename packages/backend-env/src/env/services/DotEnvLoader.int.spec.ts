import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { beforeAll, describe, expect, it } from '@jest/globals';

import { DotEnvLoader } from './DotEnvLoader';

class DotEnvLoaderTest extends DotEnvLoader<Record<string, unknown>> {
  protected parseIndex(): Record<string, unknown> {
    return { FOO: process.env['ENV_INT_TEST_FOO'] };
  }
}

describe(DotEnvLoader.name, () => {
  describe('having an env file', () => {
    let envVarName: string;
    let envVarValue: string;
    let envFilePath: string;

    beforeAll(async () => {
      envVarName = 'ENV_INT_TEST_FOO';
      envVarValue = 'bar';
      envFilePath = path.join(
        'tmp',
        'test',
        'integration',
        DotEnvLoader.name,
        '.env',
      );

      const envFileContent: string = `${envVarName}=${envVarValue}
`;

      await fs.mkdir(path.dirname(envFilePath), {
        recursive: true,
      });
      await fs.writeFile(envFilePath, envFileContent);
    });

    describe('.load', () => {
      describe('when called', () => {
        let dotEnvLoader: DotEnvLoaderTest;

        beforeAll(() => {
          dotEnvLoader = new DotEnvLoaderTest(envFilePath);
          dotEnvLoader.load();
        });

        it('should load env variables', () => {
          expect(process.env[envVarName]).toBe(envVarValue);
        });

        describe('when called .index', () => {
          let result: unknown;

          beforeAll(() => {
            result = dotEnvLoader.index;
          });

          it('should return env variables loaded', () => {
            const expected: Record<string, unknown> = {
              FOO: envVarValue,
            };

            expect(result).toStrictEqual(expected);
          });
        });
      });
    });
  });
});
