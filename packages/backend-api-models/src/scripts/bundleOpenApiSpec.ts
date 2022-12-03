#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { argv } from 'node:process';
import { promisify } from 'node:util';

import {
  JsonRootSchema202012,
  JsonRootSchema202012Object,
  JsonSchema202012,
  traverseJsonSchema,
  TraverseJsonSchemaCallbackParams,
} from '@one-game-js/json-schema-utils';
import glob from 'glob';
import yaml from 'yaml';

const globAsPromised: (
  pattern: string,
  options?: glob.IOptions | undefined,
) => Promise<string[]> = promisify(glob);

interface JsonSchemaEntry {
  $id: string;
  alias: string;
  schema: JsonRootSchema202012Object;
}

function arrayHasFiveElements<T>(value: T[]): value is [T, T, T, T, T, ...T[]] {
  const fourElementArrayLength: number = 4;

  return value.length >= fourElementArrayLength;
}

function buildOpenApiComponentSchemaRef(
  jsonSchemaEntry: JsonSchemaEntry,
): string {
  return `#/components/schemas/${jsonSchemaEntry.alias}`;
}

function checkDuplicatedIdsAndNames(
  jsonSchemaEntries: JsonSchemaEntry[],
): void {
  const duplicatedIdSet: Set<string> = new Set();
  const duplicatedNamesSet: Set<string> = new Set();

  for (let i: number = 0; i < jsonSchemaEntries.length; ++i) {
    for (let j: number = i + 1; j < jsonSchemaEntries.length; ++j) {
      const firstEntry: JsonSchemaEntry = jsonSchemaEntries[
        i
      ] as JsonSchemaEntry;
      const secondEntry: JsonSchemaEntry = jsonSchemaEntries[
        j
      ] as JsonSchemaEntry;

      if (firstEntry.$id === secondEntry.$id) {
        duplicatedIdSet.add(firstEntry.$id);
      }

      if (firstEntry.alias === secondEntry.alias) {
        duplicatedNamesSet.add(firstEntry.alias);
      }
    }
  }

  if (duplicatedIdSet.size > 0 || duplicatedNamesSet.size > 0) {
    const duplicatedIdsStringified: string = [...duplicatedIdSet.values()].join(
      ', ',
    );
    const duplicatedNamesStringified: string = [
      ...duplicatedNamesSet.values(),
    ].join(', ');

    throw new Error(
      `Found ${duplicatedIdSet.size} duplicated ids (${duplicatedIdsStringified}).
Found ${duplicatedNamesSet.size} duplicated names (${duplicatedNamesStringified}).`,
    );
  }
}

function checkDuplicatedSchemas(
  jsonSchemaEntries: JsonSchemaEntry[],
  openApiComponentsSchemas: Record<string, unknown>,
): void {
  for (const jsonSchemaEntry of jsonSchemaEntries) {
    if (jsonSchemaEntry.alias in openApiComponentsSchemas) {
      throw new Error(
        `Expecting OpenAPI schema with non conflicting schemas. OpenAPI schema defines "${buildOpenApiComponentSchemaRef(
          jsonSchemaEntry,
        )}" which enters in conflict with "${jsonSchemaEntry.$id}" JSON Schema`,
      );
    }
  }
}

async function generateAllSchemas(
  sourceFolder: string,
  openApiFilePath: string,
  destinationPath: string,
): Promise<void> {
  const schemasGlob: string = `${sourceFolder}/**/*.json`;

  const filePaths: string[] = await globAsPromised(schemasGlob, {
    cwd: '.',
  });

  const jsonSchemaEntries: JsonSchemaEntry[] = await parseJsonSchemaFiles(
    filePaths,
  );

  const openApiFileContentBuffer: Buffer = await fs.readFile(openApiFilePath);
  const stringifiedOpenApiFileContent: string =
    openApiFileContentBuffer.toString();

  const openApi: Record<string, unknown> = yaml.parse(
    stringifiedOpenApiFileContent,
  ) as Record<string, unknown>;

  const openApiComponentsSchemas: Record<string, unknown> =
    getOrCreateOpenApiComponentSchemas(openApi);

  checkDuplicatedSchemas(jsonSchemaEntries, openApiComponentsSchemas);

  for (const jsonSchemaEntry of jsonSchemaEntries) {
    openApiComponentsSchemas[jsonSchemaEntry.alias] = jsonSchemaEntry.schema;
  }

  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  await fs.writeFile(destinationPath, yaml.stringify(openApi));
}

function getOrCreateOpenApiComponentSchemas(
  openApi: Record<string, unknown>,
): Record<string, unknown> {
  if (
    openApi['components'] === null ||
    typeof openApi['components'] !== 'object'
  ) {
    openApi['components'] = {};
  }

  const openApiComponents: Record<string, unknown> = openApi[
    'components'
  ] as Record<string, unknown>;

  if (
    openApiComponents['schemas'] === null ||
    typeof openApiComponents['schemas'] !== 'object'
  ) {
    openApiComponents['schemas'] = {};
  }

  const openApiComponentsSchemas: Record<string, unknown> = openApiComponents[
    'schemas'
  ] as Record<string, unknown>;

  return openApiComponentsSchemas;
}

async function parseJsonSchemaFiles(
  filePaths: string[],
): Promise<JsonSchemaEntry[]> {
  const jsonSchemaEntries: JsonSchemaEntry[] = await Promise.all(
    filePaths.map(async (filePath: string) => parseJsonSchemaFile(filePath)),
  );

  checkDuplicatedIdsAndNames(jsonSchemaEntries);

  const idToJsonSchemaEntriesMap: Map<string, JsonSchemaEntry> = new Map(
    jsonSchemaEntries.map(
      (jsonSchemaEntry: JsonSchemaEntry): [string, JsonSchemaEntry] => [
        jsonSchemaEntry.$id,
        jsonSchemaEntry,
      ],
    ),
  );

  for (const jsonSchemaEntry of jsonSchemaEntries) {
    transformJsonSchemaRefs(jsonSchemaEntry.schema, idToJsonSchemaEntriesMap);
  }

  return jsonSchemaEntries;
}

async function parseJsonSchemaFile(path: string): Promise<JsonSchemaEntry> {
  const schemaContentBuffer: Buffer = await fs.readFile(path);
  const schemaStringifiedContent: string = schemaContentBuffer.toString();

  return parseJsonSchema(schemaStringifiedContent);
}

function parseJsonSchema(stringifiedSchema: string): JsonSchemaEntry {
  const schema: JsonRootSchema202012 = JSON.parse(
    stringifiedSchema,
  ) as JsonRootSchema202012;

  if (schema === true || schema === false) {
    throw new Error(
      'Unexpected boolean JSON schema. Expecting an object JSON schema.',
    );
  } else {
    if (schema.$id === undefined || schema.title === undefined) {
      throw new Error(
        `Unexpected object JSON schema. Expecting an object JSON schema with "$id" and "title" properties.

${stringifiedSchema}`,
      );
    } else {
      return {
        $id: schema.$id,
        alias: schema.title,
        schema: schema,
      };
    }
  }
}

function transformJsonSchemaRefs(
  schema: JsonRootSchema202012,
  idToJsonSchemaEntries: Map<string, JsonSchemaEntry>,
): void {
  traverseJsonSchema(
    { schema },
    (
      traverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams,
    ): void => {
      const schema: JsonSchema202012 = traverseJsonSchemaCallbackParams.schema;

      if (typeof schema === 'object' && schema.$ref !== undefined) {
        const jsonSchemaEntryOrUndefined: JsonSchemaEntry | undefined =
          idToJsonSchemaEntries.get(schema.$ref);

        if (jsonSchemaEntryOrUndefined !== undefined) {
          schema.$ref = buildOpenApiComponentSchemaRef(
            jsonSchemaEntryOrUndefined,
          );
        }
      }
    },
  );
}

void (async () => {
  if (arrayHasFiveElements(argv)) {
    const sourceFolder: string = argv[2];
    const openApiFilePath: string = argv[3];
    const destinationPath: string = argv[4];

    await generateAllSchemas(sourceFolder, openApiFilePath, destinationPath);
  } else {
    throw new Error('Invalid args!');
  }
})();
