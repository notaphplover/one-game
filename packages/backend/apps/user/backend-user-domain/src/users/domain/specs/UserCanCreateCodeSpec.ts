import { Spec } from '@cornie-js/backend-common';

import { User } from '../entities/User';

export class UserCanCreateCodeSpec implements Spec<[User]> {
  public isSatisfiedBy(user: User): boolean {
    return !user.active;
  }
}
