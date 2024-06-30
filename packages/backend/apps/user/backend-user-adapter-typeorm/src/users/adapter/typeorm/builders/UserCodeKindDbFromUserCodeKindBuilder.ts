import { Builder } from '@cornie-js/backend-common';
import { UserCodeKind } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

import { UserCodeKindDb } from '../models/UserCodeKindDb';

const USER_CODE_KIND_DB_TO_USER_CODE_MAP: {
  [TKey in UserCodeKind]: UserCodeKindDb;
} = {
  [UserCodeKind.registerConfirm]: UserCodeKindDb.registerConfirm,
  [UserCodeKind.resetPassword]: UserCodeKindDb.resetPassword,
};

@Injectable()
export class UserCodeKindDbFromUserCodeKindBuilder
  implements Builder<UserCodeKindDb, [UserCodeKind]>
{
  public build(userCodeKind: UserCodeKind): UserCodeKindDb {
    return USER_CODE_KIND_DB_TO_USER_CODE_MAP[userCodeKind];
  }
}
