import { Builder } from '@cornie-js/backend-common';
import {
  User,
  UserCodeCreateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { UserCodeContext } from '../models/UserCodeContext';

@Injectable()
export class UserCodeCreateQueryFromUserBuilder
  implements Builder<UserCodeCreateQuery, [User, UuidContext & UserCodeContext]>
{
  public build(
    user: User,
    context: UuidContext & UserCodeContext,
  ): UserCodeCreateQuery {
    return {
      code: context.userCode,
      id: context.uuid,
      kind: context.kind,
      userId: user.id,
    };
  }
}
