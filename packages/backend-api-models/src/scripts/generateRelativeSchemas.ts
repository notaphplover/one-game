#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { argv } from 'node:process';
import { promisify } from 'node:util';

import {
  JsonRootSchema202012,
  JsonRootSchema202012Object,
  JsonSchema202012,
  jsonSchemaRefToResourceLocation,
  ResourceLocation,
  ResourceLocationType,
  traverseJsonSchema,
  TraverseJsonSchemaCallbackParams,
} from '@one-game-js/json-schema-utils';
import glob from 'glob';

import { API_SCHEMA_HOST } from '../jsonSchema/application/models/apiSchemaHost';

const globAsPromised: (
  pattern: string,
  options?: glob.IOptions | undefined,
) => Promise<string[]> = promisify(glob);

const JSON_STRINGIFY_SPACE: number = 2;

function arrayHasFourElements<T>(value: T[]): value is [T, T, T, T, ...T[]] {
  const fourElementArrayLength: number = 4;

  return value.length >= fourElementArrayLength;
}

async function generateAllSchemas(
  sourceFolder: string,
  destinationFolder: string,
): Promise<void> {
  const schemasGlob: string = `${sourceFolder}/**/*.json`;

  const filePaths: string[] = await globAsPromised(schemasGlob, {
    cwd: '.',
  });

  await Promise.all(
    filePaths.map(async (filePath: string) =>
      generateRelativeReferencedSchemaFromSchemaPath(
        filePath,
        sourceFolder,
        getDestinationPath(sourceFolder, destinationFolder, filePath),
      ),
    ),
  );
}

async function generateRelativeReferencedSchemaFromSchemaPath(
  schemaPath: string,
  schemasRootDirectory: string,
  modelDestinationPath: string,
): Promise<void> {
  const schemaBuffer: Buffer = await fs.readFile(schemaPath);
  const schemaContent: string = schemaBuffer.toString();

  const tsModel: string = await generateRelativeReferencedFromSchema(
    schemaPath,
    JSON.parse(schemaContent) as Record<string, unknown>,
    schemasRootDirectory,
  );

  await fs.mkdir(path.dirname(modelDestinationPath), { recursive: true });

  await fs.writeFile(modelDestinationPath, tsModel);
}

async function generateRelativeReferencedFromSchema(
  schemaPath: string,
  schema: Record<string, unknown>,
  schemasRootDirectory: string,
): Promise<string> {
  const jsonSchema: JsonRootSchema202012 = schema as JsonRootSchema202012;

  traverseJsonSchema(
    { schema: jsonSchema },
    (
      traverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams,
    ): void => {
      const schema: JsonSchema202012 = traverseJsonSchemaCallbackParams.schema;

      if (typeof schema === 'object' && schema.$ref !== undefined) {
        const rootSchema: JsonRootSchema202012Object =
          jsonSchema as JsonRootSchema202012Object;

        const resourceLocation: ResourceLocation =
          jsonSchemaRefToResourceLocation(
            new Map([[API_SCHEMA_HOST, schemasRootDirectory]]),
            schema.$ref,
            rootSchema.$id,
          );

        if (resourceLocation.type === ResourceLocationType.fsPath) {
          const schemaDirectoryPath: string = path.dirname(schemaPath);
          schema.$ref = path.relative(
            schemaDirectoryPath,
            resourceLocation.rawLocation,
          );
        }
      }
    },
  );

  return JSON.stringify(schema, undefined, JSON_STRINGIFY_SPACE);
}

function getDestinationPath(
  sourceFolder: string,
  destinationFolder: string,
  filePath: string,
): string {
  const destinationPath: path.ParsedPath = path.parse(
    path.join(
      sourceFolder,
      path.relative(sourceFolder, destinationFolder),
      path.relative(sourceFolder, filePath),
    ),
  );

  const stringifiedDestinationPath: string = path.format({
    dir: destinationPath.dir,
    ext: '.json',
    name: destinationPath.name,
    root: destinationPath.root,
  });

  return stringifiedDestinationPath;
}

void (async () => {
  if (arrayHasFourElements(argv)) {
    const sourceFolder: string = argv[2];
    const destinationFolder: string = argv[3];

    await generateAllSchemas(sourceFolder, destinationFolder);
  } else {
    throw new Error('Invalid args!');
  }
})();
