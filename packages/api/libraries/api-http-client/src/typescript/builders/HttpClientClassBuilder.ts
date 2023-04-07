import ts from 'typescript';

import { HttpClientMethodOptions } from '../models/HttpClientMethodOptions';
import { HttpClientOptions } from '../models/HttpClientOptions';
import { HttpClientMethodBuilder } from './HttpClientMethodBuilder';

export const ENDPOINT_CLIENT_CLASS_NAME: string = 'HttpClient';

export class HttpClientClassBuilder {
  readonly #endpointClientMethodBuilder: HttpClientMethodBuilder;

  constructor(endpointClientMethodBuilder: HttpClientMethodBuilder) {
    this.#endpointClientMethodBuilder = endpointClientMethodBuilder;
  }

  public build(options: HttpClientOptions): ts.ClassDeclaration {
    const methodDelarations: ts.MethodDeclaration[] = options.methods.map(
      (methodOptions: HttpClientMethodOptions) =>
        this.#endpointClientMethodBuilder.build(methodOptions),
    );

    return ts.factory.createClassDeclaration(
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(ENDPOINT_CLIENT_CLASS_NAME),
      undefined,
      undefined,
      [...methodDelarations],
    );
  }
}
