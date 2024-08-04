#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { argv } from 'node:process';

import { readApiJsonSchemas } from '@cornie-js/api-json-schemas-provider';
import {
  JsonRootSchema202012,
  JsonRootSchema202012Object,
  JsonSchema202012,
} from '@cornie-js/json-schema-utils';
import {
  OpenApi3Dot1ComponentsObject,
  OpenApi3Dot1Object,
  OpenApi3Dot1SchemaObject,
} from '@cornie-js/openapi-utils';
import cloneDeep from 'clone-deep';
import yaml from 'yaml';

interface JsonSchemaEntry {
  $id: string;
  alias: string;
  schema: JsonRootSchema202012Object;
}

function arrayHasFourElements<T>(value: T[]): value is [T, T, T, T, ...T[]] {
  const fourElementArrayLength: number = 4;

  return value.length >= fourElementArrayLength;
}

function buildOpenApiComponentSchemaRef(
  jsonSchemaEntry: JsonSchemaEntry,
): string {
  return `#/components/schemas/${jsonSchemaEntry.alias}`;
}

function buildOpenApiJsonSchema(
  schema: JsonRootSchema202012,
): JsonSchema202012 {
  const schemaClone: JsonSchema202012 = cloneDeep(schema);

  if (schemaClone !== true && schemaClone !== false) {
    if (
      (schemaClone as Partial<JsonRootSchema202012Object>).$schema !== undefined
    ) {
      delete (schemaClone as Partial<JsonRootSchema202012Object>).$schema;
    }
  }

  return schemaClone;
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
      `Found ${duplicatedIdSet.size.toString()} duplicated ids (${duplicatedIdsStringified}).
Found ${duplicatedNamesSet.size.toString()} duplicated names (${duplicatedNamesStringified}).`,
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

async function generateAllSchemas(
  openApiFilePath: string,
  destinationPath: string,
): Promise<void> {
  const idToJsonSchemaEntriesMap: Map<string, JsonSchemaEntry> =
    await parseJsonSchemaFiles();

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

  for (const jsonSchemaEntry of idToJsonSchemaEntriesMap.values()) {
    openApiComponentsSchemas[jsonSchemaEntry.alias] = buildOpenApiJsonSchema(
      jsonSchemaEntry.schema,
    );
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

async function parseJsonSchemaFiles(): Promise<Map<string, JsonSchemaEntry>> {
  const jsonSchemaEntries: JsonSchemaEntry[] = (await readApiJsonSchemas()).map(
    parseJsonSchema,
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

  return idToJsonSchemaEntriesMap;
}

function parseJsonSchema(schema: JsonRootSchema202012): JsonSchemaEntry {
  if (schema === true || schema === false) {
    throw new Error(
      'Unexpected boolean JSON schema. Expecting an object JSON schema.',
    );
  } else {
    if (schema.$id === undefined || schema.title === undefined) {
      throw new Error(
        `Unexpected object JSON schema. Expecting an object JSON schema with "$id" and "title" properties.

${JSON.stringify(schema)}`,
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

void (async () => {
  if (arrayHasFourElements(argv)) {
    const openApiFilePath: string = argv[2];
    const destinationPath: string = argv[3];

    await generateAllSchemas(openApiFilePath, destinationPath);
  } else {
    throw new Error('Invalid args!');
  }
})();
