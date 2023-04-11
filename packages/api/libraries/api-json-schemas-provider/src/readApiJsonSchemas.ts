import fs from 'node:fs/promises';
import path from 'path';

import { JsonRootSchema202012 } from '@one-game-js/json-schema-utils';
import { glob } from 'glob';

const JSON_SCHEMAS_BLOB_SUFFIX: string = '**/*.json';

const API_SCHEMAS_PACKAGE: string = '@one-game-js/api-json-schemas';
const API_SCHEMAS_PACKAGE_SCHEMAS_FOLDER: string = 'schemas';

export async function readApiJsonSchemas(): Promise<JsonRootSchema202012[]> {
  const schemasPackagePath: string = path.dirname(
    require.resolve(path.join(API_SCHEMAS_PACKAGE, 'package.json')),
  );

  const jsonSchemasBlob: string = path.join(
    schemasPackagePath,
    API_SCHEMAS_PACKAGE_SCHEMAS_FOLDER,
    JSON_SCHEMAS_BLOB_SUFFIX,
  );

  const jsonSchemaPaths: string[] = await glob(jsonSchemasBlob);

  const jsonSchemas: JsonRootSchema202012[] = await Promise.all(
    jsonSchemaPaths.map(async (jsonSchemaPath: string) =>
      parseJsonFile(jsonSchemaPath),
    ),
  );

  return jsonSchemas;
}

async function parseJsonFile(path: string): Promise<JsonRootSchema202012> {
  const fileContentBuffer: Buffer = await fs.readFile(path);

  const fileStringifiedContent: string = fileContentBuffer.toString();

  const jsonSchema: JsonRootSchema202012 = JSON.parse(
    fileStringifiedContent,
  ) as JsonRootSchema202012;

  return jsonSchema;
}
