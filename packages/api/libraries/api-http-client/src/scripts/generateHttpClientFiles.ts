#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'path';
import { argv } from 'process';

import * as prettierConfig from '@cornie-js/backend-prettier-config';
import { OpenApi3Dot1Object } from '@cornie-js/openapi-utils';
import prettier from 'prettier';
import yaml from 'yaml';

import { HttpClientEndpointsClassBuilder } from '../typescript/builders/HttpClientEndpointsClassBuilder';
import { HttpClientEndpointsMethodsBuilder } from '../typescript/builders/HttpClientEndpointsMethodsBuilder';
import { HttpClientSourceFileBuilder } from '../typescript/builders/HttpClientSourceFileBuilder';
import { StringifiedSourceCodeBuilder } from '../typescript/builders/StringifiedSourceCodeBuilder';
import { HttpClientOptions } from '../typescript/models/HttpClientOptions';
import { OpenApiJsonPointerResolver } from '../typescript/resolvers/OpenApiJsonPointerResolver';

function arrayHasThreeElements<T>(value: T[]): value is [T, T, T, ...T[]] {
  const fourElementArrayLength: number = 3;

  return value.length >= fourElementArrayLength;
}

const HTTP_CLIENT_ENDPOINTS_SOURCE_FILE_NAME: string = 'HttpClientEndpoints.ts';

void (async () => {
  if (arrayHasThreeElements(argv)) {
    const destinationFolder: string = argv[2];

    await fs.mkdir(destinationFolder, { recursive: true });

    const stringifiedSourceCodeBuilder: StringifiedSourceCodeBuilder =
      new StringifiedSourceCodeBuilder();

    const endpointClientSourceFileBuilder: HttpClientSourceFileBuilder =
      new HttpClientSourceFileBuilder(
        new HttpClientEndpointsClassBuilder(
          new HttpClientEndpointsMethodsBuilder(
            new OpenApiJsonPointerResolver(),
          ),
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
      path.join(destinationFolder, HTTP_CLIENT_ENDPOINTS_SOURCE_FILE_NAME),
      await prettier.format(sourceFile, {
        ...prettierConfig,
        parser: 'typescript',
      }),
    );
  } else {
    throw new Error('Invalid args!');
  }
})();
