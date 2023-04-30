#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'path';
import { argv } from 'process';

import * as prettierConfig from '@cornie-js/backend-prettier-config';
import { OpenApi3Dot1Object } from '@cornie-js/openapi-utils';
import prettier from 'prettier';
import yaml from 'yaml';

import { HttpClientClassBuilder } from '../typescript/builders/HttpClientClassBuilder';
import { HttpClientMethodsBuilder } from '../typescript/builders/HttpClientMethodsBuilder';
import { HttpClientSourceFileBuilder } from '../typescript/builders/HttpClientSourceFileBuilder';
import { StringifiedSourceCodeBuilder } from '../typescript/builders/StringifiedSourceCodeBuilder';
import { HttpClientOptions } from '../typescript/models/HttpClientOptions';
import { OpenApiJsonPointerResolver } from '../typescript/resolvers/OpenApiJsonPointerResolver';

function arrayHasThreeElements<T>(value: T[]): value is [T, T, T, ...T[]] {
  const fourElementArrayLength: number = 3;

  return value.length >= fourElementArrayLength;
}

const HTTP_CLIENT_SOURCE_FILE_NAME: string = 'HttpClient.ts';

void (async () => {
  if (arrayHasThreeElements(argv)) {
    const destinationFolder: string = argv[2];

    await fs.mkdir(destinationFolder, { recursive: true });

    const stringifiedSourceCodeBuilder: StringifiedSourceCodeBuilder =
      new StringifiedSourceCodeBuilder();

    const endpointClientSourceFileBuilder: HttpClientSourceFileBuilder =
      new HttpClientSourceFileBuilder(
        new HttpClientClassBuilder(
          new HttpClientMethodsBuilder(new OpenApiJsonPointerResolver()),
        ),
      );

    const openApiSpecContentBuffer: Buffer = await fs.readFile(
      require.resolve(
        '@cornie-js/api-openapi-schema/schemas/generated/one-game.yaml',
      ),
    );

    const options: HttpClientOptions = {
      root: yaml.parse(
        openApiSpecContentBuffer.toString(),
      ) as OpenApi3Dot1Object,
    };

    const sourceFile: string = stringifiedSourceCodeBuilder.build(
      endpointClientSourceFileBuilder.build(options),
    );

    await fs.writeFile(
      path.join(destinationFolder, HTTP_CLIENT_SOURCE_FILE_NAME),
      prettier.format(sourceFile, {
        ...prettierConfig,
        parser: 'typescript',
      }),
    );
  } else {
    throw new Error('Invalid args!');
  }
})();
