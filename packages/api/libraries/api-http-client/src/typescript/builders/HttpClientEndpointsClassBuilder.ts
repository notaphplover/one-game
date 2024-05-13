import {
  JsonRootSchema202012Object,
  JsonSchema202012Object,
  TraverseJsonSchemaCallbackParams,
} from '@cornie-js/json-schema-utils';
import {
  OpenApi3Dot1Object,
  traverseOpenApiObjectJsonSchemas,
} from '@cornie-js/openapi-utils';
import ts from 'typescript';

import { HttpClientMethodsOptions } from '../models/HttpClientMethodsOptions';
import { HttpClientOptions } from '../models/HttpClientOptions';
import { HttpClientEndpointsMethodsBuilder } from './HttpClientEndpointsMethodsBuilder';
import { HttpClientSourceFileBuilder } from './HttpClientSourceFileBuilder';

const HTTP_CLIENT_CLASS_NAME: string = 'HttpClientEndpoints';
const HTTP_CLIENT_CONSTRUCTOR_ARGUMENT_NAME: string = 'internalHttpClient';

export class HttpClientEndpointsClassBuilder {
  public static httpClientPropertyName: string = '#internalHttpClient';

  readonly #endpointClientMethodsBuilder: HttpClientEndpointsMethodsBuilder;

  constructor(endpointClientMethodsBuilder: HttpClientEndpointsMethodsBuilder) {
    this.#endpointClientMethodsBuilder = endpointClientMethodsBuilder;
  }

  public build(options: HttpClientOptions): ts.ClassDeclaration {
    const idToSchemaMap: Map<string, JsonSchema202012Object> =
      this.#buildIdToJsonSchemaObjectMap(options.root);
    const methodDeclarations: ts.MethodDeclaration[] = [];

    if (options.root.paths !== undefined) {
      for (const [path, pathItem] of Object.entries(options.root.paths)) {
        const methodOptions: HttpClientMethodsOptions = {
          idToSchemaMap,
          path,
          pathItem,
          root: options.root,
        };

        methodDeclarations.push(
          ...this.#endpointClientMethodsBuilder.build(methodOptions),
        );
      }
    }

    return ts.factory.createClassDeclaration(
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(HTTP_CLIENT_CLASS_NAME),
      undefined,
      undefined,
      [
        this.#buildInternalHttpClientPrivateProperty(),
        this.#buildConstructorDeclaration(),
        ...methodDeclarations,
      ],
    );
  }

  #buildInternalHttpClientPrivateProperty(): ts.ClassElement {
    return ts.factory.createPropertyDeclaration(
      [ts.factory.createToken(ts.SyntaxKind.ReadonlyKeyword)],
      ts.factory.createPrivateIdentifier(
        HttpClientEndpointsClassBuilder.httpClientPropertyName,
      ),
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier(
          HttpClientSourceFileBuilder.internalHttpClientClassIdentifier,
        ),
        undefined,
      ),
      undefined,
    );
  }

  #buildConstructorDeclaration(): ts.ClassElement {
    return ts.factory.createConstructorDeclaration(
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          ts.factory.createIdentifier(HTTP_CLIENT_CONSTRUCTOR_ARGUMENT_NAME),
          undefined,
          ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier(
              HttpClientSourceFileBuilder.internalHttpClientClassIdentifier,
            ),
            undefined,
          ),
          undefined,
        ),
      ],
      ts.factory.createBlock(
        [
          ts.factory.createExpressionStatement(
            ts.factory.createBinaryExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                ts.factory.createPrivateIdentifier(
                  HttpClientEndpointsClassBuilder.httpClientPropertyName,
                ),
              ),
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createIdentifier(
                HTTP_CLIENT_CONSTRUCTOR_ARGUMENT_NAME,
              ),
            ),
          ),
        ],
        true,
      ),
    );
  }

  #buildIdToJsonSchemaObjectMap(
    root: OpenApi3Dot1Object,
  ): Map<string, JsonSchema202012Object> {
    const map: Map<string, JsonSchema202012Object> = new Map();

    traverseOpenApiObjectJsonSchemas(
      root,
      (params: TraverseJsonSchemaCallbackParams): void => {
        const schema:
          | boolean
          | JsonSchema202012Object
          | JsonRootSchema202012Object = params.schema;

        if (schema !== true && schema !== false && schema.$id !== undefined) {
          map.set(schema.$id, schema);
        }
      },
    );

    return map;
  }
}
