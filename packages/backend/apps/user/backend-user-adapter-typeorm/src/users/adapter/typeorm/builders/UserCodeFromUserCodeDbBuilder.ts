import { Builder } from '@cornie-js/backend-common';
import { UserCode, UserCodeKind } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeKindDb } from '../models/UserCodeKindDb';
import { UserCodeKindFromUserCodeKindDbBuilder } from './UserCodeKindFromUserCodeKindDbBuilder';

@Injectable()
export class UserCodeFromUserDbCodeBuilder
  implements Builder<UserCode, [UserCodeDb]>
{
  readonly #userCodeKindFromUserCodeKindDbBuilder: Builder<
    UserCodeKind,
    [UserCodeKindDb]
  >;

  constructor(
    @Inject(UserCodeKindFromUserCodeKindDbBuilder)
    userCodeKindFromUserCodeKindDbBuilder: Builder<
      UserCodeKind,
      [UserCodeKindDb]
    >,
  ) {
    this.#userCodeKindFromUserCodeKindDbBuilder =
      userCodeKindFromUserCodeKindDbBuilder;
  }

  public build(userCodeDb: UserCodeDb): UserCode {
    return {
      code: userCodeDb.code,
      kind: this.#buildUserCodeKind(userCodeDb),
      userId: userCodeDb.userId,
    };
  }

  #buildUserCodeKind(userCodeDb: UserCodeDb): UserCodeKind {
    return userCodeDb.kind === null
      ? UserCodeKind.registerConfirm
      : this.#userCodeKindFromUserCodeKindDbBuilder.build(userCodeDb.kind);
  }
}
