import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  RequestWithBody,
  Response,
  ResponseWithBody,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { PostV1UsersRequestParamHandler } from '../handlers/PostV1UsersRequestParamHandler';
import { UserManagementInputPort } from '../ports/input/UserManagementInputPort';

@Injectable()
export class PostV1UsersHttpRequestController extends HttpRequestController<
  RequestWithBody,
  [apiModels.UserCreateQueryV1],
  apiModels.UserV1
> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(PostV1UsersRequestParamHandler)
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
