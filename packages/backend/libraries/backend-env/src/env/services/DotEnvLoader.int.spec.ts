import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { DotEnvLoader } from './DotEnvLoader';

class DotEnvLoaderTest extends DotEnvLoader<Record<string, unknown>> {
  protected _parseEnv(env: Record<string, string>): Record<string, unknown> {
    return { FOO: env['ENV_INT_TEST_FOO'] };
  }

  protected override _shouldParseEnvFile(): boolean {
    return true;
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
            result = dotEnvLoader.env;
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
