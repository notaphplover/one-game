import { Injectable } from '@nestjs/common';
import { Converter } from '@one-game-js/backend-common';

import { User } from '../../../domain/models/User';
import { UserDb } from '../models/UserDb';

@Injectable()
export class UserDbToUserConverter implements Converter<UserDb, User> {
  public convert(user: UserDb): User {
    return {
      email: user.email,
      id: user.id,
      name: user.name,
    };
  }
}
