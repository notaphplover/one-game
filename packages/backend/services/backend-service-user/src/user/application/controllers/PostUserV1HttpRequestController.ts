import { models as apiModels } from '@cornie-js/api-models';
import { UserManagementInputPort } from '@cornie-js/backend-app-user';
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

import { PostUserV1RequestParamHandler } from '../handlers/PostUserV1RequestParamHandler';

@Injectable()
export class PostUserV1HttpRequestController extends HttpRequestController<
  RequestWithBody,
  [apiModels.UserCreateQueryV1],
  apiModels.UserV1
> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(PostUserV1RequestParamHandler)
    requestParamHandler: Handler<
      [RequestWithBody],
      [apiModels.UserCreateQueryV1]
    >,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.UserV1]
    >,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(UserManagementInputPort)
    userManagementInputPort: UserManagementInputPort,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
    );

    this.#userManagementInputPort = userManagementInputPort;
  }

  protected async _handleUseCase(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
  ): Promise<apiModels.UserV1> {
    return this.#userManagementInputPort.create(userCreateQueryV1);
  }
}
