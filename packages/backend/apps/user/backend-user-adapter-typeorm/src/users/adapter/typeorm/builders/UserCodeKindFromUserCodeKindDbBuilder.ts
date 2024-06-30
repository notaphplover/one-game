import { Builder } from '@cornie-js/backend-common';
import { UserCodeKind } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

import { UserCodeKindDb } from '../models/UserCodeKindDb';

const USER_CODE_KIND_TO_USER_CODE_DB_MAP: {
  [TKey in UserCodeKindDb]: UserCodeKind;
} = {
  [UserCodeKindDb.registerConfirm]: UserCodeKind.registerConfirm,
  [UserCodeKindDb.resetPassword]: UserCodeKind.resetPassword,
};

@Injectable()
export class UserCodeKindFromUserCodeKindDbBuilder
  implements Builder<UserCodeKind, [UserCodeKindDb]>
{
  public build(userCodeKind: UserCodeKindDb): UserCodeKind {
    return USER_CODE_KIND_TO_USER_CODE_DB_MAP[userCodeKind];
  }
}
