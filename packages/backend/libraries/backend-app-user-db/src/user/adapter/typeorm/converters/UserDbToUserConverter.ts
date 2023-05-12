import { User } from '@cornie-js/backend-app-user-models';
import { Converter } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { UserDb } from '../models/UserDb';

@Injectable()
export class UserDbToUserConverter implements Converter<UserDb, User> {
  public convert(user: UserDb): User {
    return {
      email: user.email,
      id: user.id,
      name: user.name,
      passwordHash: user.passwordHash,
    };
  }
}
