import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  RequestWithBody,
  Response,
  ResponseWithBody,
  HttpRequestController,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { PostAuthV1RequestParamHandler } from '../handlers/PostAuthV1RequestParamHandler';
import { AuthManagementInputPort } from '../ports/input/AuthManagementInputPort';

@Injectable()
export class PostAuthV1HttpRequestController extends HttpRequestController<
  RequestWithBody,
  [apiModels.AuthCreateQueryV1],
  apiModels.AuthV1
> {
  readonly #authManagementInputPort: AuthManagementInputPort;

  constructor(
    @Inject(PostAuthV1RequestParamHandler)
    requestParamHandler: Handler<
      [RequestWithBody],
      [apiModels.AuthCreateQueryV1]
    >,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.AuthV1]
    >,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(AuthManagementInputPort)
    authManagementInputPort: AuthManagementInputPort,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
    );

    this.#authManagementInputPort = authManagementInputPort;
  }

  protected async _handleUseCase(
    authCreateQueryV1: apiModels.AuthCreateQueryV1,
  ): Promise<apiModels.AuthV1> {
    return this.#authManagementInputPort.create(authCreateQueryV1);
  }
}
