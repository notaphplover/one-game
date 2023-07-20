import { models as apiModels } from '@cornie-js/api-models';
import { Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../ports/output/UserPersistenceOutputPort';
import { BaseUserV1EmailCodeRequestParamHandler } from './BaseUserV1EmailCodeRequestParamHandler';

@Injectable()
export class PostUserV1EmailCodeRequestParamHandler
  extends BaseUserV1EmailCodeRequestParamHandler
  implements Handler<[Request], [apiModels.UserV1]>
{
  constructor(
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
  ) {
    super(userPersistenceOutputPort);
  }

  public async handle(request: Request): Promise<[apiModels.UserV1]> {
    const userV1: apiModels.UserV1 = await this._getUserByRequestOrThrow(
      request,
    );

    return [userV1];
  }
}
