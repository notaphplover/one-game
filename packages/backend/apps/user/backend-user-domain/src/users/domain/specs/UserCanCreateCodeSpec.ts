import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { User } from '../entities/User';
import { UserCodeCreateQuery } from '../query/UserCodeCreateQuery';
import { UserCodeKind } from '../valueObjects/UserCodeKind';

@Injectable()
export class UserCanCreateCodeSpec
  implements Spec<[User, UserCodeCreateQuery]>
{
  public isSatisfiedBy(
    user: User,
    userCodeCreateQuery: UserCodeCreateQuery,
  ): boolean {
    if (user.id !== userCodeCreateQuery.userId) {
      return false;
    }

    switch (userCodeCreateQuery.kind) {
      case UserCodeKind.registerConfirm:
        return !user.active;
      case UserCodeKind.resetPassword:
        return user.active;
    }
  }
}
