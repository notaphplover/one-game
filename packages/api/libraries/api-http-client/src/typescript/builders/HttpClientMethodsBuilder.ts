import { JsonSchema202012 } from '@cornie-js/json-schema-utils';
import {
  HttpStatusCode,
  HttpStatusCodeWildCard,
  OpenApi3Dot1HeaderObject,
  OpenApi3Dot1MediaTypeObject,
  OpenApi3Dot1Object,
  OpenApi3Dot1OperationObject,
  OpenApi3Dot1ParameterObject,
  OpenApi3Dot1ParameterObjectIn,
  OpenApi3Dot1ReferenceObject,
  OpenApi3Dot1RequestBodyObject,
  OpenApi3Dot1ResponseObject,
  OpenApi3Dot1ResponsesObject,
} from '@cornie-js/openapi-utils';
import ts from 'typescript';

import { HttpClientMethodsOptions } from '../models/HttpClientMethodsOptions';
import { OpenApiJsonPointerResolver } from '../resolvers/OpenApiJsonPointerResolver';
import { HttpClientSourceFileBuilder } from './HttpClientSourceFileBuilder';

const BODY_PARAMETER_NAME: string = 'body';
const HEADERS_PARAMETER_NAME: string = 'headers';
const QUERY_PARAMETER_NAME: string = 'query';
const URL_PARAMETER_NAME: string = 'url';

const HTTP_METHOD_DELETE: string = 'DELETE';
const HTTP_METHOD_GET: string = 'GET';
const HTTP_METHOD_PATCH: string = 'PATCH';
const HTTP_METHOD_POST: string = 'POST';
const HTTP_METHOD_PUT: string = 'PUT';

const CONTENT_TYPE_JSON: string = 'application/json';

const JSON_STRINGIFY_SPACES: number = 2;

export class HttpClientMethodsBuilder {
  readonly #openApiJsonPointerResolver: OpenApiJsonPointerResolver;

  constructor(openApiJsonPointerResolver: OpenApiJsonPointerResolver) {
    this.#openApiJsonPointerResolver = openApiJsonPointerResolver;
  }

  public build(options: HttpClientMethodsOptions): ts.MethodDeclaration[] {
    return this.#buildMethodDeclarations(options);
  }

  #buildMethodDeclarations(
    options: HttpClientMethodsOptions,
  ): ts.MethodDeclaration[] {
    const methodDeclarations: ts.MethodDeclaration[] = [];

    if (options.pathItem.delete !== undefined) {
      methodDeclarations.push(
        this.#buildMethodDeclaration(
          options,
          options.pathItem.delete,
          HTTP_METHOD_DELETE,
        ),
      );
    }

    if (options.pathItem.get !== undefined) {
      methodDeclarations.push(
        this.#buildMethodDeclaration(
          options,
          options.pathItem.get,
          HTTP_METHOD_GET,
        ),
      );
    }

    if (options.pathItem.patch !== undefined) {
      methodDeclarations.push(
        this.#buildMethodDeclaration(
          options,
          options.pathItem.patch,
          HTTP_METHOD_PATCH,
        ),
      );
    }

    if (options.pathItem.post !== undefined) {
      methodDeclarations.push(
        this.#buildMethodDeclaration(
          options,
          options.pathItem.post,
          HTTP_METHOD_POST,
        ),
      );
    }

    if (options.pathItem.put !== undefined) {
      methodDeclarations.push(
        this.#buildMethodDeclaration(
          options,
          options.pathItem.put,
          HTTP_METHOD_PUT,
        ),
      );
    }

    return methodDeclarations;
  }

  #buildMethodDeclaration(
    options: HttpClientMethodsOptions,
    operation: OpenApi3Dot1OperationObject,
    httpMethod: string,
  ): ts.MethodDeclaration {
    if (operation.operationId === undefined) {
      throw new Error(`Expecting operation with operationId, , found:

${JSON.stringify(operation, undefined, JSON_STRINGIFY_SPACES)}`);
    }

    const parameterDeclarations: ts.ParameterDeclaration[] =
      this.#buildParameters(options, operation);

    return ts.factory.createMethodDeclaration(
      [
        ts.factory.createModifier(ts.SyntaxKind.PublicKeyword),
        ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword),
      ],
      undefined,
      operation.operationId,
      undefined,
      undefined,
      parameterDeclarations,
      this.#buildResponseType(options, operation.responses),
      this.#buildMethodBodyBlock(
        httpMethod,
        options.path,
        parameterDeclarations,
      ),
    );
  }

  #buildParameters(
    options: HttpClientMethodsOptions,
    operation: OpenApi3Dot1OperationObject,
  ): ts.ParameterDeclaration[] {
    const rootObject: OpenApi3Dot1Object = options.root;
    const parameterDeclarations: ts.ParameterDeclaration[] = [];

    let operationParameters: OpenApi3Dot1ParameterObject[];

    if (operation.parameters === undefined) {
      operationParameters = [];
    } else {
      const hasOperationReferenceParameters: boolean =
        operation.parameters.some(
          (
            parameter:
              | OpenApi3Dot1ParameterObject
              | OpenApi3Dot1ReferenceObject,
          ) =>
            (parameter as Partial<OpenApi3Dot1ReferenceObject>).$ref !==
            undefined,
        );

      if (hasOperationReferenceParameters) {
        throw new Error(`Operation parameter references are not currently supported :(. Found

${JSON.stringify(operation.parameters)}
`);
      }

      operationParameters =
        operation.parameters as OpenApi3Dot1ParameterObject[];
    }

    const headerParameter: ts.ParameterDeclaration | undefined =
      this.#buildParametersParameter(
        HEADERS_PARAMETER_NAME,
        operationParameters,
        OpenApi3Dot1ParameterObjectIn.header,
        this.#buildStringTypeNode(),
        false,
      );

    if (headerParameter !== undefined) {
      parameterDeclarations.push(headerParameter);
    }

    const queryParameter: ts.ParameterDeclaration | undefined =
      this.#buildParametersParameter(
        QUERY_PARAMETER_NAME,
        operationParameters,
        OpenApi3Dot1ParameterObjectIn.query,
        this.#buildStringOrStringArrayTypeNode(),
      );

    if (queryParameter !== undefined) {
      parameterDeclarations.push(queryParameter);
    }

    const urlParameter: ts.ParameterDeclaration | undefined =
      this.#buildParametersParameter(
        URL_PARAMETER_NAME,
        operationParameters,
        OpenApi3Dot1ParameterObjectIn.path,
        this.#buildStringTypeNode(),
      );

    if (urlParameter !== undefined) {
      parameterDeclarations.push(urlParameter);
    }

    if (operation.requestBody !== undefined) {
      let requestBody: OpenApi3Dot1RequestBodyObject;

      if (
        (operation.requestBody as Partial<OpenApi3Dot1ReferenceObject>).$ref ===
        undefined
      ) {
        requestBody = operation.requestBody as OpenApi3Dot1RequestBodyObject;
      } else {
        requestBody = this.#openApiJsonPointerResolver.resolveDeep(
          (operation.requestBody as OpenApi3Dot1ReferenceObject).$ref,
          rootObject,
          options.idToSchemaMap,
        ) as unknown as OpenApi3Dot1RequestBodyObject;
      }

      const applicationJsonMediaContent:
        | OpenApi3Dot1MediaTypeObject
        | undefined = requestBody.content[CONTENT_TYPE_JSON];

      if (applicationJsonMediaContent === undefined) {
        throw new Error(`Request body with not application/json content is not currently supported :(. Found

${JSON.stringify(operation.requestBody)}
`);
      }

      if (applicationJsonMediaContent.schema !== undefined) {
        const isRequired: boolean = requestBody.required ?? false;

        parameterDeclarations.push(
          this.#buildBodyParameter(
            options,
            applicationJsonMediaContent.schema,
            isRequired,
          ),
        );
      }
    }

    return parameterDeclarations;
  }

  #buildApiModelIdentifierName(
    options: HttpClientMethodsOptions,
    model: JsonSchema202012,
  ): string {
    if (typeof model === 'boolean') {
      throw new Error(`Expected object JSON schema with title, found:

${JSON.stringify(model, undefined, JSON_STRINGIFY_SPACES)}`);
    }

    let resolvedModel: JsonSchema202012;

    if (model.$ref === undefined) {
      resolvedModel = model;
    } else {
      resolvedModel = this.#openApiJsonPointerResolver.resolveDeep(
        model.$ref,
        options.root,
        options.idToSchemaMap,
      ) as JsonSchema202012;
    }

    if (
      typeof resolvedModel === 'boolean' ||
      resolvedModel.title === undefined
    ) {
      throw new Error(`Expected object JSON schema with title, found:

${JSON.stringify(model, undefined, JSON_STRINGIFY_SPACES)}`);
    }

    return `${HttpClientSourceFileBuilder.apiModelsNamespaceIdentifier}.${resolvedModel.title}`;
  }

  #buildBodyParameter(
    options: HttpClientMethodsOptions,
    requestBodySchema: JsonSchema202012,
    isRequired: boolean,
  ): ts.ParameterDeclaration {
    const typeNode: ts.TypeNode = this.#buildNodeTypeFromSchema(
      options,
      requestBodySchema,
    );

    const parameterDeclaration: ts.ParameterDeclaration =
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier(BODY_PARAMETER_NAME),
        undefined,
        isRequired
          ? typeNode
          : ts.factory.createUnionTypeNode([
              typeNode,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
            ]),
        undefined,
      );

    return parameterDeclaration;
  }

  #buildMethodBodyBlock(
    httpMethod: string,
    path: string,
    parameterDeclarations: ts.ParameterDeclaration[],
  ): ts.Block {
    if (
      parameterDeclarations.some(
        (parameterDeclaration: ts.ParameterDeclaration) =>
          parameterDeclaration.name.kind !== ts.SyntaxKind.Identifier,
      )
    ) {
      throw new Error('Expecting Identifier based parameter declarations!');
    }

    const isParameterWithName: (name: string) => boolean = (
      name: string,
    ): boolean =>
      parameterDeclarations.some(
        (parameterDeclaration: ts.ParameterDeclaration) =>
          (parameterDeclaration.name as ts.Identifier).text === name,
      );

    const buildParameterName: (name: string) => string = (
      name: string,
    ): string => (isParameterWithName(name) ? name : 'undefined');

    const methodParameter: ts.StringLiteral = ts.factory.createStringLiteral(
      httpMethod,
      true,
    );

    const pathParameter: ts.StringLiteral = ts.factory.createStringLiteral(
      path,
      true,
    );

    const headerParameter: ts.Identifier = ts.factory.createIdentifier(
      buildParameterName(HEADERS_PARAMETER_NAME),
    );

    const queryParameter: ts.Identifier = ts.factory.createIdentifier(
      buildParameterName(QUERY_PARAMETER_NAME),
    );

    const urlParameter: ts.Identifier = ts.factory.createIdentifier(
      buildParameterName(URL_PARAMETER_NAME),
    );

    const bodyParameter: ts.Identifier = ts.factory.createIdentifier(
      buildParameterName(BODY_PARAMETER_NAME),
    );

    const axiosHttpClientCall: ts.ReturnStatement =
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createThis(),
              ts.factory.createPrivateIdentifier('#axiosHttpClient'),
            ),
            ts.factory.createIdentifier('callEndpoint'),
          ),
          undefined,
          [
            ts.factory.createObjectLiteralExpression([
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('body'),
                bodyParameter,
              ),
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('headers'),
                headerParameter,
              ),
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('method'),
                methodParameter,
              ),
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('url'),
                pathParameter,
              ),
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('queryParams'),
                queryParameter,
              ),
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('urlParameters'),
                urlParameter,
              ),
            ]),
          ],
        ),
      );

    return ts.factory.createBlock([axiosHttpClientCall]);
  }

  #buildNodeTypeFromSchema(
    options: HttpClientMethodsOptions,
    schema: JsonSchema202012,
  ): ts.TypeNode {
    return ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier(
        this.#buildApiModelIdentifierName(options, schema),
      ),
    );
  }

  #buildParametersParameter(
    name: string,
    parameters: OpenApi3Dot1ParameterObject[],
    parameterKind: OpenApi3Dot1ParameterObjectIn,
    type: ts.TypeNode,
    avoidIfNoParameters: boolean = true,
  ): ts.ParameterDeclaration | undefined {
    const parameterDeclarationElements: ts.TypeElement[] = [
      this.#buildStringToTypeIndexSignatureTypeElement(type),
    ];

    const parametersOfKind: OpenApi3Dot1ParameterObject[] = parameters.filter(
      (parameter: OpenApi3Dot1ParameterObject) =>
        parameter.in === parameterKind,
    );

    if (parametersOfKind.length === 0 && avoidIfNoParameters) {
      return undefined;
    }

    for (const parameter of parametersOfKind) {
      const parameterProperty: ts.PropertySignature =
        ts.factory.createPropertySignature(
          [],
          parameter.name,
          parameter.required === true
            ? undefined
            : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          type,
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

  #buildResponseHeadersType(
    options: HttpClientMethodsOptions,
    headers: Record<
      string,
      OpenApi3Dot1ReferenceObject | OpenApi3Dot1HeaderObject
    >,
  ): ts.TypeNode {
    const typeElements: ts.TypeElement[] = [
      this.#buildStringToStringIndexSignatureTypeElement(),
    ];

    for (const headerName of Object.keys(headers)) {
      let headerObject: OpenApi3Dot1ReferenceObject | OpenApi3Dot1HeaderObject =
        headers[headerName] as
          | OpenApi3Dot1ReferenceObject
          | OpenApi3Dot1HeaderObject;

      if (
        (headerObject as Partial<OpenApi3Dot1ReferenceObject>).$ref !==
        undefined
      ) {
        headerObject = this.#openApiJsonPointerResolver.resolveDeep(
          (headerObject as OpenApi3Dot1ReferenceObject).$ref,
          options.root,
          options.idToSchemaMap,
        ) as unknown as OpenApi3Dot1HeaderObject;
      }

      const headerObjectObject: OpenApi3Dot1HeaderObject =
        headerObject as OpenApi3Dot1HeaderObject;

      typeElements.push(
        ts.factory.createPropertySignature(
          undefined,
          headerName,
          headerObjectObject.required === true
            ? undefined
            : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          this.#buildStringTypeNode(),
        ),
      );
    }

    return ts.factory.createTypeLiteralNode(typeElements);
  }

  #buildResponseType(
    options: HttpClientMethodsOptions,
    responses: OpenApi3Dot1ResponsesObject | undefined,
  ): ts.TypeNode {
    if (responses === undefined) {
      return ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('Promise'),
        [
          ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier('Response'),
            [
              ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier('Record'),
                [
                  ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                  ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                ],
              ),
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            ],
          ),
        ],
      );
    }

    const responseTypes: ts.TypeNode[] = [];

    for (const statusCode of Object.keys(responses) as (
      | HttpStatusCode
      | HttpStatusCodeWildCard
    )[]) {
      let statusCodeType: ts.TypeNode;

      if (this.#isHttpStatusCodeWildCard(statusCode)) {
        statusCodeType = ts.factory.createKeywordTypeNode(
          ts.SyntaxKind.NumberKeyword,
        );
      } else {
        statusCodeType = ts.factory.createLiteralTypeNode(
          ts.factory.createNumericLiteral(statusCode),
        );
      }

      let responseObject:
        | OpenApi3Dot1ReferenceObject
        | OpenApi3Dot1ResponseObject = responses[statusCode] as
        | OpenApi3Dot1ReferenceObject
        | OpenApi3Dot1ResponseObject;

      if (
        (responseObject as Partial<OpenApi3Dot1ReferenceObject>).$ref !==
        undefined
      ) {
        responseObject = this.#openApiJsonPointerResolver.resolveDeep(
          (
            responseObject as Partial<OpenApi3Dot1ReferenceObject> as OpenApi3Dot1ReferenceObject
          ).$ref,
          options.root,
          options.idToSchemaMap,
        ) as unknown as OpenApi3Dot1ResponseObject;
      }

      const responseObjectObject: OpenApi3Dot1ResponseObject =
        responseObject as OpenApi3Dot1ResponseObject;

      const responseObjectHeaders:
        | Record<string, OpenApi3Dot1ReferenceObject | OpenApi3Dot1HeaderObject>
        | undefined = responseObjectObject.headers;

      let headersType: ts.TypeNode;

      if (responseObjectHeaders === undefined) {
        headersType = this.#buildStringToStringRecordTypeNode();
      } else {
        headersType = this.#buildResponseHeadersType(
          options,
          responseObjectHeaders,
        );
      }

      let responseBodyType: ts.TypeNode;

      if (responseObjectObject.content === undefined) {
        responseBodyType = ts.factory.createKeywordTypeNode(
          ts.SyntaxKind.UndefinedKeyword,
        );
      } else {
        const applicationJsonMediaContent:
          | OpenApi3Dot1MediaTypeObject
          | undefined = responseObjectObject.content[CONTENT_TYPE_JSON];

        if (applicationJsonMediaContent?.schema === undefined) {
          responseBodyType = ts.factory.createKeywordTypeNode(
            ts.SyntaxKind.UnknownKeyword,
          );
        } else {
          responseBodyType = this.#buildNodeTypeFromSchema(
            options,
            applicationJsonMediaContent.schema,
          );
        }
      }

      responseTypes.push(
        ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('Response'),
          [headersType, responseBodyType, statusCodeType],
        ),
      );
    }

    return ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier('Promise'),
      [ts.factory.createUnionTypeNode(responseTypes)],
    );
  }

  #buildStringToStringRecordTypeNode(): ts.TypeNode {
    return ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier('Record'),
      [
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ],
    );
  }

  #buildStringToStringIndexSignatureTypeElement(): ts.TypeElement {
    return this.#buildStringToTypeIndexSignatureTypeElement(
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    );
  }

  #buildStringToTypeIndexSignatureTypeElement(
    typeNode: ts.TypeNode,
  ): ts.TypeElement {
    return ts.factory.createIndexSignature(
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          ts.factory.createIdentifier('key'),
          undefined,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          undefined,
        ),
      ],
      typeNode,
    );
  }

  #buildStringTypeNode(): ts.TypeNode {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
  }

  #buildStringOrStringArrayTypeNode(): ts.TypeNode {
    return ts.factory.createUnionTypeNode([
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ts.factory.createArrayTypeNode(
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
    ]);
  }

  #isHttpStatusCodeWildCard(
    statusCode: HttpStatusCode | HttpStatusCodeWildCard,
  ): statusCode is HttpStatusCodeWildCard {
    return statusCode.endsWith('XX');
  }
}
