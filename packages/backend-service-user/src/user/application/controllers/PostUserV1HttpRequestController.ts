import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/backend-api-models';
import { Builder, Handler } from '@one-game-js/backend-common';
import {
  RequestWithBody,
  Response,
  ResponseWithBody,
  SingleEntityHttpRequestController,
  SingleEntityPostResponseBuilder,
} from '@one-game-js/backend-http';

import { PostUserV1RequestParamHandler } from '../handlers/PostUserV1RequestParamHandler';
import { UserManagementInputPort } from '../ports/input/UserManagementInputPort';

@Injectable()
export class PostUserV1HttpRequestController extends SingleEntityHttpRequestController<
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
      [apiModels.UserV1 | undefined]
    >,
    @Inject(UserManagementInputPort)
    userManagementInputPort: UserManagementInputPort,
  ) {
    super(requestParamHandler, responseBuilder);

    this.#userManagementInputPort = userManagementInputPort;
  }

  protected async _handleUseCase(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
  ): Promise<undefined> {
    await this.#userManagementInputPort.create(userCreateQueryV1);

    return undefined;
  }
}
