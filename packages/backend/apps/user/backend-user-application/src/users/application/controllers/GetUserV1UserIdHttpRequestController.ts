import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  MiddlewarePipeline,
  Request,
  Response,
  ResponseWithBody,
  SingleEntityGetResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AccessTokenAuthMiddleware } from '../../../auth/application/middlewares/AccessTokenAuthMiddleware';
import { GetUserV1UserIdRequestParamHandler } from '../handlers/GetUserV1UserIdRequestParamHandler';
import { UserManagementInputPort } from '../ports/input/UserManagementInputPort';

@Injectable()
export class GetUserV1UserIdHttpRequestController extends HttpRequestController<
  Request,
  [string],
  apiModels.UserV1 | undefined
> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(GetUserV1UserIdRequestParamHandler)
    requestParamHandler: Handler<[Request], [string]>,
    @Inject(SingleEntityGetResponseBuilder)
    responseBuilder: Builder<Response, [apiModels.UserV1 | undefined]>,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(UserManagementInputPort)
    userManagementInputPort: UserManagementInputPort,
    @Inject(AccessTokenAuthMiddleware)
    authMiddleware: AccessTokenAuthMiddleware,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware]),
    );

    this.#userManagementInputPort = userManagementInputPort;
  }

  protected async _handleUseCase(
    userId: string,
  ): Promise<apiModels.UserV1 | undefined> {
    return this.#userManagementInputPort.findOne(userId);
  }
}
