import { models as apiModels } from '@cornie-js/api-models';
import { UserMeUpdateQueryV1 } from '@cornie-js/api-models/lib/models/types';
import { UserManagementInputPort } from '@cornie-js/backend-app-user';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  MiddlewarePipeline,
  Response,
  ResponseWithBody,
  SingleEntityPatchResponseBuilder,
  HttpRequestController,
  RequestWithBody,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { PatchUserV1MeRequestParamHandler } from '../handlers/PatchUserV1MeRequestParamHandler';

@Injectable()
export class PatchUserV1MeHttpRequestController extends HttpRequestController<
  RequestWithBody,
  [apiModels.UserV1, apiModels.UserMeUpdateQueryV1],
  apiModels.UserV1
> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(PatchUserV1MeRequestParamHandler)
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
    @Inject(AuthMiddleware)
    authMiddleware: AuthMiddleware,
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
    userMeUpdateQueryV1: UserMeUpdateQueryV1,
  ): Promise<apiModels.UserV1> {
    return this.#userManagementInputPort.updateMe(
      userV1.id,
      userMeUpdateQueryV1,
    );
  }
}
