import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { User, UserFindQuery } from '@cornie-js/backend-user-domain/users';

import { UserPersistenceOutputPort } from '../ports/output/UserPersistenceOutputPort';

export abstract class BaseUserV1EmailCodeRequestParamHandler {
  public static emailUrlParameter: string = 'email';

  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;

  constructor(userPersistenceOutputPort: UserPersistenceOutputPort) {
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
  }

  protected async _getUserByRequestOrThrow(request: Request): Promise<User> {
    const emailUrlParam: string | undefined =
      request.urlParameters[
        BaseUserV1EmailCodeRequestParamHandler.emailUrlParameter
      ];

    if (emailUrlParam === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Unexpected missing "${BaseUserV1EmailCodeRequestParamHandler.emailUrlParameter}" url parameter`,
      );
    }

    const user: User = await this.#getUserByEmailOrThrow(emailUrlParam);

    return user;
  }

  async #getUserByEmailOrThrow(email: string): Promise<User> {
    const userFindQuery: UserFindQuery = {
      email,
    };

    const user: User | undefined =
      await this.#userPersistenceOutputPort.findOne(userFindQuery);

    if (user === undefined) {
      throw new AppError(AppErrorKind.entityNotFound, 'User not found');
    }

    return user;
  }
}
