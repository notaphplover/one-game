import fs from 'node:fs/promises';
import path from 'node:path';

import { glob } from 'glob';

const FILES_BLOB_SUFFIX: string = '**/*.graphql';

const API_PACKAGE: string = '@cornie-js/api-graphql-schemas';
const API_PACKAGE_SCHEMAS_FOLDER: string = 'schemas';

export async function readApiGraphqlSchemas(): Promise<string[]> {
  const schemasPackagePath: string = path.dirname(
    require.resolve(path.join(API_PACKAGE, 'package.json')),
  );

  const graphqlSchemasBlob: string = path.join(
    schemasPackagePath,
    API_PACKAGE_SCHEMAS_FOLDER,
    FILES_BLOB_SUFFIX,
  );

  const graphqlSchemasPaths: string[] = await glob(graphqlSchemasBlob);

  const graphqlSchemas: string[] = await Promise.all(
    graphqlSchemasPaths.map(async (jsonSchemaPath: string) =>
      parseGraphqlFile(jsonSchemaPath),
    ),
  );

  return graphqlSchemas;
}

async function parseGraphqlFile(path: string): Promise<string> {
  const fileContentBuffer: Buffer = await fs.readFile(path);

  const fileStringifiedContent: string = fileContentBuffer.toString();

  return fileStringifiedContent;
}
