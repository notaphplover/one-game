import { Builder } from '@cornie-js/backend-common';
import { User } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

import { UserDb } from '../models/UserDb';

@Injectable()
export class UserFromUserDbBuilder implements Builder<UserDb, [User]> {
  public build(user: UserDb): User {
    return {
      active: user.active,
      email: user.email,
      id: user.id,
      name: user.name,
      passwordHash: user.passwordHash,
    };
  }
}
