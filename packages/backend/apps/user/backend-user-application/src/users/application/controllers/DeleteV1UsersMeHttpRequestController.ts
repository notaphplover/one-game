import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  MiddlewarePipeline,
  Request,
  Response,
  ResponseWithBody,
  SingleEntityDeleteResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AccessTokenAuthMiddleware } from '../../../auth/application/middlewares/AccessTokenAuthMiddleware';
import { DeleteV1UsersMeRequestParamHandler } from '../handlers/DeleteV1UsersMeRequestParamHandler';
import { UserManagementInputPort } from '../ports/input/UserManagementInputPort';

@Injectable()
export class DeleteV1UsersMeHttpRequestController extends HttpRequestController<
  Request,
  [apiModels.UserV1],
  undefined
> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(DeleteV1UsersMeRequestParamHandler)
    requestParamHandler: Handler<[Request], [apiModels.UserV1]>,
    @Inject(SingleEntityDeleteResponseBuilder)
    responseBuilder: Builder<Response, [apiModels.UserV1 | undefined]>,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(AccessTokenAuthMiddleware)
    authMiddleware: AccessTokenAuthMiddleware,
    @Inject(UserManagementInputPort)
    userManagementInputPort: UserManagementInputPort,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware]),
    );

    this.#userManagementInputPort = userManagementInputPort;
  }

  protected async _handleUseCase(userV1: apiModels.UserV1): Promise<undefined> {
    await this.#userManagementInputPort.delete(userV1.id);
  }
}
