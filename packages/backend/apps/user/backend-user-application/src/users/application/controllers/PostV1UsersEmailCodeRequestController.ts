import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  Request,
  Response,
  ResponseWithBody,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { User, UserCodeKind } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { PostUserV1EmailCodeRequestParamHandler } from '../handlers/PostUserV1EmailCodeRequestParamHandler';
import { UserCodeManagementInputPort } from '../ports/input/UserCodeManagementInputPort';

@Injectable()
export class PostV1UsersEmailCodeRequestController extends HttpRequestController<
  Request,
  [User, UserCodeKind],
  undefined
> {
  readonly #userCodeManagementInputPort: UserCodeManagementInputPort;

  constructor(
    @Inject(PostUserV1EmailCodeRequestParamHandler)
    requestParamHandler: Handler<[Request], [User, UserCodeKind]>,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<Response, [undefined]>,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(UserCodeManagementInputPort)
    userCodeManagementInputPort: UserCodeManagementInputPort,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
    );

    this.#userCodeManagementInputPort = userCodeManagementInputPort;
  }

  protected async _handleUseCase(
    user: User,
    userCodeKind: UserCodeKind,
  ): Promise<undefined> {
    await this.#userCodeManagementInputPort.createFromUser(user, userCodeKind);
  }
}
