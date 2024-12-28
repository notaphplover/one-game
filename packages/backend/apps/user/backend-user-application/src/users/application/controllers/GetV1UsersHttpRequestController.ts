import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  MiddlewarePipeline,
  MultipleEntitiesGetResponseBuilder,
  Request,
  Response,
  ResponseWithBody,
} from '@cornie-js/backend-http';
import { UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { AccessTokenAuthMiddleware } from '../../../auth/application/middlewares/AccessTokenAuthMiddleware';
import { GetV1UsersRequestParamHandler } from '../handlers/GetV1UsersRequestParamHandler';
import { UserManagementInputPort } from '../ports/input/UserManagementInputPort';

@Injectable()
export class GetV1UsersHttpRequestController extends HttpRequestController<
  Request,
  [UserFindQuery],
  (apiModels.UserV1 | undefined)[]
> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(GetV1UsersRequestParamHandler)
    requestParamHandler: Handler<[Request], [UserFindQuery]>,
    @Inject(MultipleEntitiesGetResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.UserV1[]]
    >,
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
    userFindQuery: UserFindQuery,
  ): Promise<(apiModels.UserV1 | undefined)[]> {
    return this.#userManagementInputPort.find(userFindQuery);
  }
}
