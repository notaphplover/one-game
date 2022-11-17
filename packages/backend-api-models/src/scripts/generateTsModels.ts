#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { argv } from 'node:process';
import { promisify } from 'node:util';

import { Options as $RefOptions } from '@bcherny/json-schema-ref-parser';
import { Builder, UseCase } from '@one-game-js/backend-common';
import glob from 'glob';
import { compile } from 'json-schema-to-typescript';

import { ResolveApiSchemaHttpReferenceQuery } from '../jsonSchema/application/queries/ResolveApiSchemaHttpReferenceQuery';
import { ResolveApiSchemaHttpReferenceUseCase } from '../jsonSchema/application/useCases/ResolveApiSchemaHttpReferenceUseCase';
import { SchemasRefParserOptionsBuilder } from '../jsonSchema/infrastructure/bchernyJsonSchemaRefParser/SchemasRefParserOptionsBuilder';

const resolveApiSchemaHttpReferenceUseCase: UseCase<
  ResolveApiSchemaHttpReferenceQuery,
  Buffer
> = new ResolveApiSchemaHttpReferenceUseCase();

const schemasRefParserOptionsBuilder: Builder<$RefOptions, [string]> =
  new SchemasRefParserOptionsBuilder(resolveApiSchemaHttpReferenceUseCase);

const globAsPromised: (
  pattern: string,
  options?: glob.IOptions | undefined,
) => Promise<string[]> = promisify(glob);

function arrayHasFourElements<T>(value: T[]): value is T[] & [T, T, T, T] {
  const fourElementArrayLength: number = 4;

  return value.length >= fourElementArrayLength;
}

async function generateAllSchemas(
  sourceFolder: string,
  destinationFolder: string,
): Promise<void> {
  const schemasGlob: string = `${sourceFolder}/api/types.json`;

  const filePaths: string[] = await globAsPromised(schemasGlob, {
    cwd: '.',
  });

  await Promise.all(
    filePaths.map(async (filePath: string) =>
      generateTypescriptModelFromSchemaPath(
        filePath,
        sourceFolder,
        getDestinationPath(sourceFolder, destinationFolder, filePath),
      ),
    ),
  );
}

async function generateTypescriptModelFromSchemaPath(
  schemaPath: string,
  schemasRootDirectory: string,
  modelDestinationPath: string,
): Promise<void> {
  const schemaBuffer: Buffer = await fs.readFile(schemaPath);
  const schemaContent: string = schemaBuffer.toString();

  const tsModel: string = await generateTypescriptModelFromSchema(
    path.basename(schemaPath),
    JSON.parse(schemaContent) as Record<string, unknown>,
    schemasRootDirectory,
  );

  await fs.mkdir(path.dirname(modelDestinationPath), { recursive: true });

  await fs.writeFile(modelDestinationPath, tsModel);
}

async function generateTypescriptModelFromSchema(
  schemaName: string,
  schema: Record<string, unknown>,
  schemasRootDirectory: string,
): Promise<string> {
  const refParserOptions: $RefOptions =
    schemasRefParserOptionsBuilder.build(schemasRootDirectory);

  const tsModel: string = await compile(schema, schemaName, {
    $refOptions: refParserOptions,
    bannerComment: `/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the generation script to regenerate this file.
 */`,
    cwd: schemasRootDirectory,
    declareExternallyReferenced: true,
    ignoreMinAndMaxItems: true,
    strictIndexSignatures: true,
    unknownAny: true,
  });

  return tsModel;
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
      filePath,
    ),
  );

  const stringifiedDestinationPath: string = path.format({
    dir: destinationPath.dir,
    ext: '.ts',
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
