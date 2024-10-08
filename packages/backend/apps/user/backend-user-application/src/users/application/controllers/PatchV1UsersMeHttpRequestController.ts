import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  MiddlewarePipeline,
  RequestWithBody,
  Response,
  ResponseWithBody,
  SingleEntityPatchResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AccessTokenAuthMiddleware } from '../../../auth/application/middlewares/AccessTokenAuthMiddleware';
import { PatchV1UsersMeRequestParamHandler } from '../handlers/PatchV1UsersMeRequestParamHandler';
import { UserManagementInputPort } from '../ports/input/UserManagementInputPort';

@Injectable()
export class PatchV1UsersMeHttpRequestController extends HttpRequestController<
  RequestWithBody,
  [apiModels.UserV1, apiModels.UserMeUpdateQueryV1],
  apiModels.UserV1
> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(PatchV1UsersMeRequestParamHandler)
    requestParamHandler: Handler<
      [RequestWithBody],
      [apiModels.UserV1, apiModels.UserMeUpdateQueryV1]
    >,
    @Inject(SingleEntityPatchResponseBuilder)
    responseBuilder: Builder<Response, [apiModels.UserV1]>,
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

  protected async _handleUseCase(
    userV1: apiModels.UserV1,
    userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
  ): Promise<apiModels.UserV1> {
    return this.#userManagementInputPort.updateMe(
      userV1.id,
      userMeUpdateQueryV1,
    );
  }
}
