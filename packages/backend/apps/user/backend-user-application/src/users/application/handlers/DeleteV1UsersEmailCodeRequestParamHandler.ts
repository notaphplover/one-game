import { Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { User } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../ports/output/UserPersistenceOutputPort';
import { BaseV1UsersEmailCodeRequestParamHandler } from './BaseV1UsersEmailCodeRequestParamHandler';

@Injectable()
export class DeleteV1UsersEmailCodeRequestParamHandler
  extends BaseV1UsersEmailCodeRequestParamHandler
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
