import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  RequestWithBody,
  Response,
  ResponseWithBody,
  HttpRequestController,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { PostAuthV2RequestParamHandler } from '../handlers/PostAuthV2RequestParamHandler';
import { AuthManagementInputPort } from '../ports/input/AuthManagementInputPort';

@Injectable()
export class PostAuthV2HttpRequestController extends HttpRequestController<
  RequestWithBody,
  [apiModels.AuthCreateQueryV2 | undefined, Request | RequestWithBody],
  apiModels.AuthV2
> {
  readonly #authManagementInputPort: AuthManagementInputPort;

  constructor(
    @Inject(PostAuthV2RequestParamHandler)
    requestParamHandler: Handler<
      [Request | RequestWithBody],
      [apiModels.AuthCreateQueryV2 | undefined, Request | RequestWithBody]
    >,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.AuthV2]
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
    authCreateQueryV2: apiModels.AuthCreateQueryV2 | undefined,
  ): Promise<apiModels.AuthV2> {
    if (authCreateQueryV2 === undefined) {
      throw new AppError(
        AppErrorKind.contractViolation,
        'Expecting a JSON body',
      );
    }

    return this.#authManagementInputPort.createByQueryV2(authCreateQueryV2);
  }
}
