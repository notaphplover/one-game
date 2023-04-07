import { JsonSchema202012 } from '@one-game-js/json-schema-utils';
import ts from 'typescript';

import { HttpClientMethodOptions } from '../models/HttpClientMethodOptions';
import { HttpClientMethodOptionsParameter } from '../models/HttpClientMethodOptionsParameter';
import { HttpClientSourceFileBuilder } from './HttpClientSourceFileBuilder';

const BODY_PARAMETER_NAME: string = 'body';
const HEADERS_PARAMETER_NAME: string = 'headers';
const QUERY_PARAMETER_NAME: string = 'query';
const URL_PARAMETER_NAME: string = 'url';

export class HttpClientMethodBuilder {
  public build(options: HttpClientMethodOptions): ts.MethodDeclaration {
    return ts.factory.createMethodDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.PublicKeyword)],
      undefined,
      options.name,
      undefined,
      undefined,
      this.#buildParameters(options),
      undefined,
      ts.factory.createBlock([]),
    );
  }

  #buildParameters(
    options: HttpClientMethodOptions,
  ): ts.ParameterDeclaration[] {
    const parameterDeclarations: ts.ParameterDeclaration[] = [];

    if (options.parameters.headers.length > 0) {
      parameterDeclarations.push(
        this.#buildParametersParameter(
          HEADERS_PARAMETER_NAME,
          options.parameters.headers,
        ),
      );
    }

    if (options.parameters.query.length > 0) {
      parameterDeclarations.push(
        this.#buildParametersParameter(
          QUERY_PARAMETER_NAME,
          options.parameters.query,
        ),
      );
    }

    if (options.parameters.url.length > 0) {
      parameterDeclarations.push(
        this.#buildParametersParameter(
          URL_PARAMETER_NAME,
          options.parameters.url,
        ),
      );
    }

    if (options.requestBodySchema !== undefined) {
      parameterDeclarations.push(
        this.#buildBodyParameter(options.requestBodySchema),
      );
    }

    return parameterDeclarations;
  }

  #buildApiModelIdentifierName(model: JsonSchema202012): string {
    if (typeof model === 'boolean' || model.title === undefined) {
      throw new Error(`Expected object JSON schema with title, found:

${JSON.stringify(model)}`);
    }

    return `${HttpClientSourceFileBuilder.apiModelsNamespaceIdentifier}.${model.title}`;
  }

  #buildBodyParameter(
    requestBodySchema: JsonSchema202012,
  ): ts.ParameterDeclaration {
    const parameterDeclaration: ts.ParameterDeclaration =
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier(BODY_PARAMETER_NAME),
        undefined,
        ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier(
            this.#buildApiModelIdentifierName(requestBodySchema),
          ),
        ),
        undefined,
      );

    return parameterDeclaration;
  }

  #buildParametersParameter(
    name: string,
    parameters: HttpClientMethodOptionsParameter[],
  ): ts.ParameterDeclaration {
    const parameterDeclarationElements: ts.TypeElement[] = [];

    for (const parameter of parameters) {
      const parameterProperty: ts.PropertySignature =
        ts.factory.createPropertySignature(
          [],
          parameter.name,
          parameter.required === true
            ? undefined
            : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        );

      parameterDeclarationElements.push(parameterProperty);
    }

    const parameterDeclaration: ts.ParameterDeclaration =
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier(name),
        undefined,
        ts.factory.createTypeLiteralNode(parameterDeclarationElements),
        undefined,
      );

    return parameterDeclaration;
  }
}
