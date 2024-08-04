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
import { GetUserV1MeRequestParamHandler } from '../handlers/GetUserV1MeRequestParamHandler';
import { UserDetailManagementInputPort } from '../ports/input/UserDetailManagementInputPort';

@Injectable()
export class GetUserV1MeDetailHttpRequestController extends HttpRequestController<
  Request,
  [apiModels.UserV1],
  apiModels.UserDetailV1 | undefined
> {
  readonly #userDetailManagementInputPort: UserDetailManagementInputPort;

  constructor(
    @Inject(GetUserV1MeRequestParamHandler)
    requestParamHandler: Handler<[Request], [apiModels.UserV1]>,
    @Inject(SingleEntityGetResponseBuilder)
    responseBuilder: Builder<Response, [apiModels.UserDetailV1 | undefined]>,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(AccessTokenAuthMiddleware)
    authMiddleware: AccessTokenAuthMiddleware,
    @Inject(UserDetailManagementInputPort)
    userDetailManagementInputPort: UserDetailManagementInputPort,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware]),
    );

    this.#userDetailManagementInputPort = userDetailManagementInputPort;
  }

  protected async _handleUseCase(
    userV1: apiModels.UserV1,
  ): Promise<apiModels.UserDetailV1 | undefined> {
    return this.#userDetailManagementInputPort.findOne(userV1.id);
  }
}
