import { Builder } from '@cornie-js/backend-common';
import { UserCode, UserCodeKind } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

import { UserCodeDb } from '../models/UserCodeDb';

@Injectable()
export class UserCodeFromUserDbCodeBuilder
  implements Builder<UserCode, [UserCodeDb]>
{
  public build(userCodeDb: UserCodeDb): UserCode {
    return {
      code: userCodeDb.code,
      kind: UserCodeKind.registerConfirm,
      userId: userCodeDb.userId,
    };
  }
}
