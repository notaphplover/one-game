import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  Request,
  Response,
  ResponseWithBody,
  SingleEntityDeleteResponseBuilder,
} from '@cornie-js/backend-http';
import { User } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { DeleteV1UsersEmailCodeRequestParamHandler } from '../handlers/DeleteV1UsersEmailCodeRequestParamHandler';
import { UserCodeManagementInputPort } from '../ports/input/UserCodeManagementInputPort';

@Injectable()
export class DeleteV1UsersEmailCodeRequestController extends HttpRequestController<
  Request,
  [User],
  undefined
> {
  readonly #userCodeManagementInputPort: UserCodeManagementInputPort;

  constructor(
    @Inject(DeleteV1UsersEmailCodeRequestParamHandler)
    requestParamHandler: Handler<[Request], [User]>,
    @Inject(SingleEntityDeleteResponseBuilder)
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

  protected async _handleUseCase(user: User): Promise<undefined> {
    await this.#userCodeManagementInputPort.deleteFromUser(user);
  }
}
