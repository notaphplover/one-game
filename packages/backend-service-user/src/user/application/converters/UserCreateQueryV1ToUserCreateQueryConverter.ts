import { Injectable } from '@nestjs/common';
import { UserCreateQueryV1 } from '@one-game-js/backend-api-models/lib/models/types';
import { Converter } from '@one-game-js/backend-common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../foundation/hash/application/models/HashContext';
import { UserCreateQuery } from '../../domain/models/UserCreateQuery';

@Injectable()
export class UserCreateQueryV1ToUserCreateQueryConverter
  implements Converter<UserCreateQueryV1, UserCreateQuery, UuidContext>
{
  public convert(
    userCreateQueryV1: UserCreateQueryV1,
    context: HashContext & UuidContext,
  ): UserCreateQuery {
    return {
      email: userCreateQueryV1.email,
      id: context.uuid,
      name: userCreateQueryV1.name,
      passwordHash: context.hash,
    };
  }
}
