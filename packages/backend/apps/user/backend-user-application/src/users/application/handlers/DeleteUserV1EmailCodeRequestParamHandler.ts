import { Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { User } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../ports/output/UserPersistenceOutputPort';
import { BaseUserV1EmailCodeRequestParamHandler } from './BaseUserV1EmailCodeRequestParamHandler';

@Injectable()
export class DeleteUserV1EmailCodeRequestParamHandler
  extends BaseUserV1EmailCodeRequestParamHandler
  implements Handler<[Request], [User]>
{
  constructor(
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
  ) {
    super(userPersistenceOutputPort);
  }

  public async handle(request: Request): Promise<[User]> {
    const user: User = await this._getUserByRequestOrThrow(request);

    return [user];
  }
}
