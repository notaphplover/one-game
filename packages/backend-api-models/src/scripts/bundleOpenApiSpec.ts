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
import {
  OpenApi3Dot1ComponentsObject,
  OpenApi3Dot1Object,
  OpenApi3Dot1SchemaObject,
  traverseOpenApiObjectJsonSchemas,
} from '@one-game-js/openapi-utils';
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
  jsonSchemaEntries: Iterable<JsonSchemaEntry>,
  openApiComponentsSchemas: Record<string, OpenApi3Dot1SchemaObject>,
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

function traverseOpenApiJsonSchemas(
  idToJsonSchemaEntriesMap: Map<string, JsonSchemaEntry>,
  openApiObject: OpenApi3Dot1Object,
): void {
  traverseOpenApiObjectJsonSchemas(
    openApiObject,
    (params: TraverseJsonSchemaCallbackParams): void => {
      if (params.schema !== true && params.schema !== false) {
        if (
          (params.schema as JsonRootSchema202012Object).$schema !== undefined
        ) {
          delete (params.schema as Partial<JsonRootSchema202012Object>).$schema;
        }

        if (params.schema.$ref !== undefined) {
          const jsonSchemaEntry: JsonSchemaEntry | undefined =
            idToJsonSchemaEntriesMap.get(params.schema.$ref);

          if (jsonSchemaEntry !== undefined) {
            params.schema.$ref =
              buildOpenApiComponentSchemaRef(jsonSchemaEntry);
          }
        }
      }
    },
  );
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

  const idToJsonSchemaEntriesMap: Map<string, JsonSchemaEntry> =
    await parseJsonSchemaFiles(filePaths);

  const openApiFileContentBuffer: Buffer = await fs.readFile(openApiFilePath);
  const stringifiedOpenApiFileContent: string =
    openApiFileContentBuffer.toString();

  const openApi: OpenApi3Dot1Object = yaml.parse(
    stringifiedOpenApiFileContent,
  ) as OpenApi3Dot1Object;

  const openApiComponentsSchemas: Record<string, OpenApi3Dot1SchemaObject> =
    getOrCreateOpenApiComponentSchemas(openApi);

  checkDuplicatedSchemas(
    idToJsonSchemaEntriesMap.values(),
    openApiComponentsSchemas,
  );

  traverseOpenApiJsonSchemas(idToJsonSchemaEntriesMap, openApi);

  for (const jsonSchemaEntry of idToJsonSchemaEntriesMap.values()) {
    openApiComponentsSchemas[jsonSchemaEntry.alias] = jsonSchemaEntry.schema;
  }

  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  await fs.writeFile(destinationPath, yaml.stringify(openApi));
}

function getOrCreateOpenApiComponentSchemas(
  openApi: OpenApi3Dot1Object,
): Record<string, OpenApi3Dot1SchemaObject> {
  if (openApi.components === undefined) {
    openApi.components = {};
  }

  const openApiComponents: OpenApi3Dot1ComponentsObject = openApi.components;

  if (openApiComponents.schemas === undefined) {
    openApiComponents.schemas = {};
  }

  const openApiComponentsSchemas: Record<string, OpenApi3Dot1SchemaObject> =
    openApiComponents.schemas;

  return openApiComponentsSchemas;
}

async function parseJsonSchemaFiles(
  filePaths: string[],
): Promise<Map<string, JsonSchemaEntry>> {
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

  return idToJsonSchemaEntriesMap;
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
