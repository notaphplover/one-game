import ts from 'typescript';

import { HttpClientMethodsOptions } from '../models/HttpClientMethodsOptions';
import { HttpClientOptions } from '../models/HttpClientOptions';
import { HttpClientMethodsBuilder } from './HttpClientMethodsBuilder';
import { HttpClientSourceFileBuilder } from './HttpClientSourceFileBuilder';

const HTTP_CLIENT_CLASS_NAME: string = 'HttpClient';
const BASE_URL_CONSTRUCTOR_ARGUMENT_NAME: string = 'baseUrl';

export class HttpClientClassBuilder {
  public static axiosHttpBuilderPropertyName: string = '#axiosHttpClient';

  readonly #endpointClientMethodsBuilder: HttpClientMethodsBuilder;

  constructor(endpointClientMethodsBuilder: HttpClientMethodsBuilder) {
    this.#endpointClientMethodsBuilder = endpointClientMethodsBuilder;
  }

  public build(options: HttpClientOptions): ts.ClassDeclaration {
    const methodDeclarations: ts.MethodDeclaration[] = [];

    if (options.root.paths !== undefined) {
      for (const [path, pathItem] of Object.entries(options.root.paths)) {
        const methodOptions: HttpClientMethodsOptions = {
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
        this.#buildAxiosHttpClientPrivateProperty(),
        this.#buildConstructorDeclaration(),
        ...methodDeclarations,
      ],
    );
  }

  #buildAxiosHttpClientPrivateProperty(): ts.ClassElement {
    return ts.factory.createPropertyDeclaration(
      [ts.factory.createToken(ts.SyntaxKind.ReadonlyKeyword)],
      ts.factory.createPrivateIdentifier(
        HttpClientClassBuilder.axiosHttpBuilderPropertyName,
      ),
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier(
          HttpClientSourceFileBuilder.axiosHttpClientClassIdentifier,
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
          ts.factory.createIdentifier(BASE_URL_CONSTRUCTOR_ARGUMENT_NAME),
          undefined,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
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
                  HttpClientClassBuilder.axiosHttpBuilderPropertyName,
                ),
              ),
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createNewExpression(
                ts.factory.createIdentifier(
                  HttpClientSourceFileBuilder.axiosHttpClientClassIdentifier,
                ),
                undefined,
                [
                  ts.factory.createIdentifier(
                    BASE_URL_CONSTRUCTOR_ARGUMENT_NAME,
                  ),
                ],
              ),
            ),
          ),
        ],
        true,
      ),
    );
  }
}
