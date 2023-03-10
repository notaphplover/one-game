import { Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Converter } from '@one-game-js/backend-common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../foundation/hash/application/models/HashContext';
import { UserCreateQuery } from '../../domain/models/UserCreateQuery';

@Injectable()
export class UserCreateQueryV1ToUserCreateQueryConverter
  implements
    Converter<apiModels.UserCreateQueryV1, UserCreateQuery, UuidContext>
{
  public convert(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
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
