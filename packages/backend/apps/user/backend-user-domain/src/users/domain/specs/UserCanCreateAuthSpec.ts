import { Spec } from '@cornie-js/backend-common';

import { User } from '../models/User';

export class UserCanCreateAuthSpec implements Spec<[User]> {
  public isSatisfiedBy(user: User): boolean {
    return user.active;
  }
}
